const joi = require('joi');
const extensions = require('./lib');

const phoneNumber = '09123334433';
// const phoneNumber = '۰۹۱۲۴۴۴۳۳۲۲';

const custom = joi.extend(...extensions);

const schema = custom.object({
  // phone: custom.persianPhoneNumber().withOperator()
  phone: custom.persianPhoneNumber()
});

const a = schema.validate({ phone: phoneNumber });
console.log( a)