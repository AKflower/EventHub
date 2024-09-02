// controllers/paymentController.js

const axios = require("axios");
const crypto = require("crypto");
const querystring = require("querystring");
const moment = require('moment');

// Cấu hình VNPay
// const vnpayConfig = {
//   vnp_TmnCode: "YOUR_TMN_CODE", // Mã đơn vị
//   vnp_HashSecret: "YOUR_SECRET_KEY", // Secret key
//   vnp_Url: "https://sandbox.vnpayment.vn/merchant_webapi/partner.html", // URL thanh toán
//   vnp_ReturnUrl: "http://yourdomain.com/return", // URL trả về sau khi thanh toán
//   vnp_NotifyUrl: "http://yourdomain.com/notify", // URL thông báo kết quả thanh toán
// };
const vnpayConfig = {
  vnp_TmnCode:"U6BO5JL3",
  vnp_HashSecret:"81PVSCVK9DRNBK2GZCLX0POJR9O95Y4M",
  vnp_Url:"https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  vnp_Api:"https://sandbox.vnpayment.vn/merchant_webapi/api/transaction",
  vnp_ReturnUrl: "http://localhost:3001/api/bookings"
}

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
// const createVnPayPaymentUrl = (amount, orderId) => {
//   const params = {
//     vnp_Version: "2.0.0",
//     vnp_Command: "pay",
//     vnp_TmnCode: vnpayConfig.vnp_TmnCode,
//     vnp_Amount: amount * 100, // Số tiền cần thanh toán
//     vnp_CurrCode: "VND",
//     vnp_OrderInfo: `Order ${orderId}`,
//     vnp_OrderType: "billpayment",
//     vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
//     vnp_TxnRef: orderId,
//     vnp_CreateDate: new Date().toISOString().replace(/[-:.TZ]/g, ""),
//     vnp_ExpireDate: new Date(new Date().getTime() + 15 * 60000)
//       .toISOString()
//       .replace(/[-:.TZ]/g, ""),
//   };
//   params.vnp_SecureHash = generateVnPaySignature(params);
//   return `${vnpayConfig.vnp_Url}?${querystring.stringify(params)}`;
// };
const createVnPayPaymentUrl = async (req,res) => {
  
  process.env.TZ = 'Asia/Ho_Chi_Minh';
  
  let date = new Date();
  let createDate = moment(date).format('YYYYMMDDHHmmss');
  
  let ipAddr = req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

  // let config = require('config');
  
  let tmnCode = vnpayConfig.vnp_TmnCode;
  let secretKey = vnpayConfig.vnp_HashSecret;
  let vnpUrl = vnpayConfig.vnp_Url;
  let returnUrl = vnpayConfig.vnp_ReturnUrl+'/'+req.body.bookingId+'/paysuccess'; // Trả về success
  let orderId = moment(date).format('DDHHmmss');
  let amount = req.body.amount;
  let bankCode = req.body.bankCode;
  
  let locale = req.body.language;
  if(locale === null || locale === ''){
      locale = 'vn';
  }
  let currCode = 'VND';
  let vnp_Params = {};
  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = tmnCode;
  vnp_Params['vnp_Locale'] = locale;
  vnp_Params['vnp_CurrCode'] = currCode;
  vnp_Params['vnp_TxnRef'] = orderId;
  vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
  vnp_Params['vnp_OrderType'] = 'other';
  vnp_Params['vnp_Amount'] = amount * 100;
  vnp_Params['vnp_ReturnUrl'] = returnUrl;
  vnp_Params['vnp_IpAddr'] = ipAddr;
  vnp_Params['vnp_CreateDate'] = createDate;
  if(bankCode !== null && bankCode !== ''){
      vnp_Params['vnp_BankCode'] = bankCode;
  }
 

  vnp_Params = sortObject(vnp_Params);

  let querystring = require('qs');
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require("crypto");     
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
  vnp_Params['vnp_SecureHash'] = signed;
  vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
  console.log('test',vnpUrl);
  return vnpUrl ;
};

function sortObject(obj) {
	let sorted = {};
	let str = [];
	let key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key));
		}
	}
	str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

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
  // const { amount, orderId } = req.body;
  req.body.language='vn';
  req.body.bankCode='';
  const paymentUrl = await createVnPayPaymentUrl(req, res);
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

// exports.paySuccess = async (req,res) => {
//   const { bookingId } = req.params;
//   try {
//     const result = await db.query(
//       `UPDATE booking SET status`
//     );
//     if (result.rows.length === 0) {
//       return res.status(404).send("Booking Not Found");
//     }
//     res.status(200).json(result.rows[0]);
//   }
//   catch (err) {
//     res.status(500).send("Internal Server Error");
//   }
// }