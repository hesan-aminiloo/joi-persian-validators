const joi = require('joi');
const extensions = require('./lib');

const phoneNumber = '09123334433';
// const id = '0013681354';
// const id = '۰۰۱۳۶۸۱۳۵۴';

const custom = joi.extend(...extensions);

const schema = custom.object({
  phone: custom.persianPhoneNumber(),
  id: custom.persianIdNumber(),
});

const a = schema.validate({ phone: phoneNumber, id });
console.log(a)