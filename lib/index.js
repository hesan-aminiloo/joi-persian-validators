const TOTAL_NATIONAL_ID_LENGTH = 11;

const convertToEnglishNumbers = (num) => {
  const convertedNumber = num.toString().replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
  return (typeof num === 'number') ? '0' + convertedNumber : convertedNumber;
};

const getOperatorType = (phoneNumber) => {
  const irancellReg = new RegExp(/^0930|0933|0935|0936|0937|0938|0939|0900|0901|0902|0903|0904|0905|0941/);
  const mciReg = new RegExp(/^0911|0912|0913|0914|0915|0916|0917|0918/);
  const rightelReg = new RegExp(/^0920|0921|0922/);
  if (phoneNumber.match(irancellReg)) return 'irancell';
  if (phoneNumber.match(mciReg)) return 'mci';
  if (phoneNumber.match(rightelReg)) return 'rightel';
  return 'unknown';
};

module.exports = [
  (joi) => {
    return {
      type: 'phone',
      base: joi.string(),
      messages: {
        'phoneMsg.base': '{{#label}} must be a persian phone number',
        'phoneMsg.characters': '{{#label}} must be exactly 11 characters',
        'phoneMsg.irancell': '{{#label}} must be an Irancell operator',
        'phoneMsg.mci': '{{#label}} must be a MCI operator',
        'phoneMsg.rightel': '{{#label}} must be a Rightel operator',
      },
      prepare(value) {
        // In case user entered persian numbers
        return { value: convertToEnglishNumbers(value) };
      },
      validate(value, helpers) {
        // Base validation regardless of the rules applied
        if (!value.startsWith('09')) return { value, errors: helpers.error('phoneMsg.base') }

        if (value.length !== 11) return { value, errors: helpers.error('phoneMsg.characters') }

        if (helpers.schema.$_getFlag('operator')) {
          return { value: { value, op: getOperatorType(value) } }
        }
      },
      rules: {
        irancell: {
          validate(value, helpers) {
              const irancellReg = new RegExp(/^0930|0933|0935|0936|0937|0938|0939|0900|0901|0902|0903|0904|0905|0941/);
              if (!value.match(irancellReg)) return helpers.error('phoneMsg.irancell');
              return value;
          }
        },
        mci: {
          convert: true,
          validate(value, helpers) {
              const mciReg = new RegExp(/^0911|0912|0913|0914|0915|0916|0917|0918/);
              if (!value.match(mciReg)) return helpers.error('phoneMsg.mci');
              return value;
          }
        },
        rightel: {
          convert: true,
          validate(value, helpers) {
              const rightelReg = new RegExp(/^0920|0921|0922/);
              if (!value.match(rightelReg)) return helpers.error('phoneMsg.rightel');
              return value;
          }
        },
        with: {
          method({ operator }) {
            return this.$_setFlag('operator', operator);
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
      prepare(value) {
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
        const checkDigit = parseInt(idNumber.split('').pop());
        if (total % TOTAL_NATIONAL_ID_LENGTH <= 2) {
          if (checkDigit === total % TOTAL_NATIONAL_ID_LENGTH) return { value };
        } else {
          if (checkDigit === (TOTAL_NATIONAL_ID_LENGTH - (total % TOTAL_NATIONAL_ID_LENGTH))) return { value };
          return { value, errors: helpers.error('persianIdNumber.base')};
        }
      }
    };
  },
]