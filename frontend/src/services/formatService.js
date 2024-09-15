const formatService = {
    formatPrice: (num) => {
        if (!num) return 0;
        return num.toLocaleString('vi-VN');
    },
    formatDateDDMMYYYY: (isoString) => {
        if (!isoString) return isoString;
        const date = new Date(isoString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0 nên cộng thêm 1
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    },
    parseFormattedPrice: (str) => {
        if (!str) return 0;
        return parseFloat(str.replace(/\./g, '').replace(/,/g, '.'));
    },
    formatDateYYYYMMDD: (timeStamp) => {
        if (timeStamp=='' || !timeStamp) return timeStamp;
        return  timeStamp.split('T')[0];
        
    },
    formatDate: (dateString) => {
        const date = new Date(dateString);
      
        // Lấy giờ, phút, ngày, tháng, và năm
        const hours = String(date.getUTCHours()).padStart(2, '0'); // Lấy giờ và đảm bảo 2 chữ số
        const minutes = String(date.getUTCMinutes()).padStart(2, '0'); // Lấy phút và đảm bảo 2 chữ số
        const day = String(date.getUTCDate()).padStart(2, '0'); // Lấy ngày và đảm bảo 2 chữ số
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Lấy tháng và đảm bảo 2 chữ số
        const year = date.getUTCFullYear(); // Lấy năm
      
        // Định dạng theo HH:mm DDMMYYYY
        return `${hours}:${minutes} ${day}/${month}/${year}`;
      }
}
export default formatService;