export const phoneValidation = {
    phone: (value) => (/^0[0-9]*$/.test(value)) && value?.length == 10 ? null : "Số điện thoại không hợp lệ", 
   
};