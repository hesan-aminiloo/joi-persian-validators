const joi = require('joi');
const extensions = require('./lib');

const phoneNumber = '00337778899';
const id = '۰۰۱۳۶۸۱۳۵۴';

const pJoi = joi.extend(...extensions);

const schema = pJoi.object({
  phone: pJoi.mobile().messages({
    'mobile.base': 'شماره ای که وارد کردید اشتباه است',
    'mobile.irancell': 'شماره ای که وارد کردید باید ایرانسل باشد',
    'mobile.characters': 'طول اعداد وارد شده باید دقیقا ۱۱ تا باشه',
  }),
  id: pJoi.idNumber(),
})

const { value, error } = schema.validate({ phone: phoneNumber, id });
