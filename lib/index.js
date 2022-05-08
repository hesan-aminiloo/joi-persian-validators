const convertToEnglishNumbers = (num) => {
  const convertedNumber = num.toString().replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
  return (typeof num === 'number') ? '0' + convertedNumber : convertedNumber;
};

module.exports = [
  (joi) => {
    return {
      type: 'persianPhoneNumber',
      base: joi.string(),
      messages: {
        'persianPhoneNumber.base': '{{#label}} must be a persian phone number',
        'persianPhoneNumber.characters': '{{#label}} must be exactly 11 characters',
        'persianPhoneNumber.irancell': '{{#label}} must be an Irancell operator',
        'persianPhoneNumber.mci': '{{#label}} must be a MCI operator',
        'persianPhoneNumber.rightel': '{{#label}} must be a Rightel operator',
      },
      coerce(value) {
        // In case user entered persian numbers
        return { value: convertToEnglishNumbers(value) };
      },
      validate(value, helpers) {
        // Base validation regardless of the rules applied
        if (!value.startsWith('09')) return { value, errors: helpers.error('persianPhoneNumber.base') }

        if (value.length !== 11) return { value, errors: helpers.error('persianPhoneNumber.characters') }
      },
      rules: {
        irancell: {
          convert: true,
          validate(value, helpers) {
              const irancellReg = new RegExp(/^0930|0933|0935|0936|0937|0938|0939|0900|0901|0902|0903|0904|0905|0941/);
              if (!value.match(irancellReg)) return helpers.error('persianPhoneNumber.irancell');
              return value;
          }
        },
        mci: {
          convert: true,
          validate(value, helpers) {
              const mciReg = new RegExp(/^0911|0912|0913|0914|0915|0916|0917|0918/);
              if (!value.match(mciReg)) return helpers.error('persianPhoneNumber.mci');
              return value;
          }
        },
        rightel: {
          convert: true,
          validate(value, helpers) {
              const rightelReg = new RegExp(/^0920|0921|0922/);
              if (!value.match(rightelReg)) return helpers.error('persianPhoneNumber.rightel');
              return value;
          }
        }
      }
    };
  },
  (joi) => {
    return {
      type: 'persianIdNumber',
      base: joi.string(),
      messages: {
        'persianIdNumber.base': '{{#label}} must be a valid Iranian national ID number',
        'persianIdNumber.characters': '{{#label}} must be exactly 10 characters'
      },
      coerce(value) {
        // In case user entered persian numbers
        return { value: convertToEnglishNumbers(value) };
      },
      validate(value, helpers) {
        const idNumber = value.toString();
        if (idNumber.length !== 10) return { value, errors: helpers.error('persianIdNumber.characters')};
        let total = 0;
        idNumber.split('').forEach((digit, index) => {
          if ((10 - index) !== 1) total += parseInt(digit) * (10 - index);
        });
        const checkNum = parseInt(idNumber.split('').pop());
        if (total % 11 <= 2) {
          if (checkNum === total % 11) return { value };
        } else {
          if (checkNum === (11 - (total % 11))) return { value };
          return { value, errors: helpers.error('persianIdNumber.base')};
        }
      }
    };
  },
]