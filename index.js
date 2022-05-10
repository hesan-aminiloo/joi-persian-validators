const joi = require('joi');
const extensions = require('./lib');

// const phoneNumber = '09123334333';
const phoneNumber = '۰۹33۷۷۸۸56۴';
// const id = '0013681354';
const id = '۰۰۱۳۶۸۱۳۵۴';

const custom = joi.extend(...extensions);

const schema = custom.object({
  phone: custom.phone().with({ operator: true }).required().messages({
    'phoneMsg.irancell': 'شماره ای که وارد کردید باید ایرانسل باشد',
    'phoneMsg.characters': 'طول اعداد وارد شده باید دقیقا ۱۱ تا باشه',
  }),
  id: custom.persianIdNumber(),
})

const a = schema.validate({ phone: phoneNumber, id });
console.log(a)