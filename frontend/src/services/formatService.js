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
        
    }
}
export default formatService;