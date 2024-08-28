// controllers/paymentController.js

const axios = require("axios");
const crypto = require("crypto");
const querystring = require("querystring");

// Cấu hình VNPay
const vnpayConfig = {
  vnp_TmnCode: "YOUR_TMN_CODE", // Mã đơn vị
  vnp_HashSecret: "YOUR_SECRET_KEY", // Secret key
  vnp_Url: "https://sandbox.vnpayment.vn/merchant_webapi/partner.html", // URL thanh toán
  vnp_ReturnUrl: "http://yourdomain.com/return", // URL trả về sau khi thanh toán
  vnp_NotifyUrl: "http://yourdomain.com/notify", // URL thông báo kết quả thanh toán
};

// Cấu hình MoMo
const momoConfig = {
  partnerCode: "YOUR_PARTNER_CODE",
  accessKey: "YOUR_ACCESS_KEY",
  secretKey: "YOUR_SECRET_KEY",
  endpoint: "https://test-payment.momo.vn/gw_payment/transactionProcessor", // URL thanh toán
  returnUrl: "http://yourdomain.com/return", // URL trả về sau khi thanh toán
};

// Hàm tạo chữ ký VNPay
const generateVnPaySignature = (params) => {
  const secret = vnpayConfig.vnp_HashSecret;
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((obj, key) => {
      obj[key] = params[key];
      return obj;
    }, {});
  const queryString = querystring.stringify(sortedParams, { encode: false });
  return crypto.createHmac("sha512", secret).update(queryString).digest("hex");
};

// Hàm tạo URL thanh toán VNPay
const createVnPayPaymentUrl = (amount, orderId) => {
  const params = {
    vnp_Version: "2.0.0",
    vnp_Command: "pay",
    vnp_TmnCode: vnpayConfig.vnp_TmnCode,
    vnp_Amount: amount * 100, // Số tiền cần thanh toán
    vnp_CurrCode: "VND",
    vnp_OrderInfo: `Order ${orderId}`,
    vnp_OrderType: "billpayment",
    vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
    vnp_TxnRef: orderId,
    vnp_CreateDate: new Date().toISOString().replace(/[-:.TZ]/g, ""),
    vnp_ExpireDate: new Date(new Date().getTime() + 15 * 60000)
      .toISOString()
      .replace(/[-:.TZ]/g, ""),
  };
  params.vnp_SecureHash = generateVnPaySignature(params);
  return `${vnpayConfig.vnp_Url}?${querystring.stringify(params)}`;
};

// Hàm tạo chữ ký MoMo
const generateMomoSignature = (data) => {
  return crypto
    .createHmac("sha256", momoConfig.secretKey)
    .update(data)
    .digest("hex");
};

// Hàm tạo yêu cầu thanh toán MoMo
const createMomoPaymentRequest = async (amount, orderId) => {
  const orderInfo = `Order ${orderId}`;
  const requestId = `${orderId}-${Date.now()}`;
  const requestBody = {
    partnerCode: momoConfig.partnerCode,
    accessKey: momoConfig.accessKey,
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    returnUrl: momoConfig.returnUrl,
    notifyUrl: "http://yourdomain.com/notify",
    requestType: "captureWallet",
    signature: generateMomoSignature(
      `partnerCode=${momoConfig.partnerCode}&accessKey=${momoConfig.accessKey}&requestId=${requestId}&amount=${amount}&orderId=${orderId}&orderInfo=${orderInfo}&returnUrl=${momoConfig.returnUrl}&notifyUrl=http://yourdomain.com/notify`
    ),
  };

  const response = await axios.post(momoConfig.endpoint, requestBody);
  return response.data;
};

// API để tạo yêu cầu thanh toán VNPay
exports.payWithVNPay = async (req, res) => {
  const { amount, orderId } = req.body;
  const paymentUrl = createVnPayPaymentUrl(amount, orderId);
  res.json({ paymentUrl });
};

// API để tạo yêu cầu thanh toán MoMo
exports.payWithMoMo = async (req, res) => {
  const { amount, orderId } = req.body;
  try {
    const paymentResponse = await createMomoPaymentRequest(amount, orderId);
    res.json(paymentResponse);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

// Xử lý thông báo từ VNPay
exports.vnpNotify = (req, res) => {
  // Xác thực dữ liệu và cập nhật trạng thái đơn hàng
  res.sendStatus(200);
};

// Xử lý kết quả thanh toán từ VNPay sau khi người dùng quay lại
exports.vnpReturn = (req, res) => {
  const { vnp_TransactionNo, vnp_Amount, vnp_TxnRef, vnp_SecureHash } =
    req.query;
  // Xác thực kết quả thanh toán và cập nhật trạng thái đơn hàng
  res.send("Payment result");
};

// Xử lý thông báo từ MoMo
exports.momoNotify = (req, res) => {
  // Xác thực dữ liệu và cập nhật trạng thái đơn hàng
  res.sendStatus(200);
};

// Xử lý kết quả thanh toán từ MoMo sau khi người dùng quay lại
exports.momoReturn = (req, res) => {
  const { resultCode, message, transId } = req.query;
  // Xác thực kết quả thanh toán và cập nhật trạng thái đơn hàng
  res.send("Payment result");
};
