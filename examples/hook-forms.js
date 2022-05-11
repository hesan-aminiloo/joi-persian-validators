import React from "react";
import { useForm } from "react-hook-form";

/* Use Joi object validators */
import Joi from "joi";

/* Use Joi resolver for react hook form */
import { joiResolver } from "@hookform/resolvers/joi";

/* Persian Joi validators */
import joiExtenstions from "joi-persian-validators";

const pJoi = Joi.extend(...joiExtenstions);

const schema = pJoi.object({
  mobile: pJoi.mobile().with({ operator: true }).messages({
    'mobile.base': 'شماره موبایل وارد شده اشتباه است',
    'mobile.characters': 'شماره موبایل باید دقیقا ۱۱ شماره باشد'
  }),
  id: pJoi.idNumber()
});

export default function App() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: joiResolver(schema)
  });

  const onSubmit = (data) => {
    console.log("data", data);
  };

  return (
    <div className="App">
      <h1>Persian Joi Validator</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label>شماره موبایل</label>
        <input {...register("mobile")} />
        {<div className="error">{errors.mobile?.message}</div>}

        <label>کد ملی</label>
        <input {...register("id")} />
        {<div className="error">{errors.id?.message}</div>}
        <input type="submit" />
      </form>
    </div>
  );
}
