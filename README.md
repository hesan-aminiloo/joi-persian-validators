# Joi Persian Validators
A set of persion validations built on top of Joi object validator. This idea came to my mind when I had to rewrite the same validator over and over again. Feel free to open an issue to ask for more validation rules.

[Demo](https://codesandbox.io/s/react-hook-form-validationresolver-forked-6o94kj?file=/src/App.js)

## ⚓️ Installation
Install the package using yarn or npm
```js
npm i joi joi-persian-validators

// or

yarn add joi joi-persian-validators
```

## 📜 How to use it
This library is a set of extenstions of top of Joi validator, thus you can use it with react-hook-forms or formik. Feel free to take a look at examples.
Using this lib is fairly simple, first you need to import the lib;
```js
import joi from 'joi';
import persianJoi from 'joi-persian-validators';
```
then you have to add persian extenstions to your joi instance.
```js
// Add custom validators to a single joi instance
const pJoi = joi.extend(...persianJoi);

// Then create your custom schema
const schema = pJoi.object({
  mobile: pJoi.mobile(),
  id: pJoi.idNumber()
});

// commonjs
const Joi = require('joi').extend(...require('joi-persian-validators'));

// Then create your custom schema
const schema = Joi.object({
  mobile: Joi.mobile(),
  id: Joi.idNumber()
});
```

#### Example
To see how it works with `react-hook-forms` see this [Example](./examples/hook-forms.js)
```js
import joi from 'joi';
import extensions from 'joi-persian-validators';

const phoneNumber = '09123334433';
// Also you can use persian characters, the value will be returned with english characters
const testId = '۴۳۱۱۰۲۰۴۶۵';

const pJoi = joi.extend(...extensions);

const schema = custom.object({
  phone: pJoi.phone(),
  id: pJoi.idNumber(),
});

const { value } = schema.validate({ phone: phoneNumber, id: testId });
// value = { phone: '09123334433', id: '4311020465' }

```

## 📃 Validators
| **Validator**  | **API**       | **Extra rules**                                                | **Description**                                                                                                         |
|----------------|---------------|----------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| **Mobile**     | `.mobile()`   | `.irancell()`, `mci()`, `rightel(), .with({ operator: true })` | Validate a mobile phone number. Additional rules lets you to force the user to enter the desired operator phone number. |
| **NationalID** | `.idNumber()` |                                                                | Validate Iranian national id number.                                                                                    |


`.with({ operator: true })` will return the phone number with the operator but `.irancell()`, `.mci()`, `.rightel()` will force the user to enter a number with the given rule.

## 💬 Displaying custom messages
```js
const schema = pJoi.object({
  phone: pJoi.mobile().messages({
    'mobile.base': 'شماره ای که وارد کردید اشتباه است',
    'mobile.irancell': 'شماره ای که وارد کردید حتما باید ایرانسل باشد',
    'mobile.characters': 'طول شماره وارد شده باید دقیقا ۱۱ باشد',
  }),
  id: pJoi.idNumber(),
});

/*
  Valid Data
*/
const phoneNumber = '09332221122';
const id = '۴۳۱۱۰۲۰۴۶۵';

const { value } = schema.validate({ phone: phoneNumber, id });

// value = 
// { phone: '09332221122', id: '4311020465' }

/*
  Invalid Data
*/
const phoneNumber = '00332221122';
const id = '۴۳۱۱۰۲۰۴۶۵';

const { value, error } = schema.validate({ phone: phoneNumber, id });

// error =
/* 
{ phone: '00332221122', id: '۴۳۱۱۰۲۰۴۶۵' } [Error [ValidationError]: شماره ای که وارد کردید اشتباه است] {
  _original: { phone: '00332221122', id: '۴۳۱۱۰۲۰۴۶۵' },
  details: [
    {
      message: 'شماره ای که وارد کردید اشتباه است',
      path: [Array],
      type: 'mobile.base',
      context: [Object]
    }
  ]
}
*/
```

## 🎯 TODOS
Please feel free to create an issue to suggest new validators or new features.
- [x] ~~Add mobile number validator~~
- [x] ~~Add Iranian national ID validators~~
- [x] ~~Get phone operator~~
- [ ] Add phone number validator
- [ ] Add birthday validator (Maybe?)
- [ ] Add bank account validators
- [ ] Add postal code validators

