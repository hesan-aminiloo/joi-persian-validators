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
        return { value: convertToEnglishNumbers(value) };
      },
      validate(value, helpers) {
        // Base validation regardless of the rules applied
        // console.log(helpers);
        // console.log(helpers.schema.$_getRule('withOperator'));
        // console.log(helpers.schema.$_validate());
        // console.log(helpers.schema.$_getRule('withOperator'));

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
        },
        withOperator: {
          convert: true,
          validate(value, helpers, args, options) {
            return value;
            // if (value % args.q === 0) {
            //     return value;       // Value is valid
            // }

            // return helpers.error('million.dividable', { q: args.q });
          }
        }
      }
    };
  },
  (joi) => {
    return {
      type: 'persianIdNumber',
      base: joi.number(),
      validate(value, helpers) {

            // Base validation regardless of the rules applied

            if (value < 1000000) {
                return { value, errors: helpers.error('million.base') };
            }

            // Check flags for global state

            if (helpers.schema.$_getFlag('big') &&
                value < 5000000) {

                return { value, errors: helpers.error('million.big') };
            }
        },
    };
  },
]