import React, { useRef } from "react";
import SecondaryButton from "../UI/buttons/SecondaryButton";
import Link from "next/link";
import classes from "./LoginForm.module.scss";
import FormField from "../UI/forms/FormField";
import PrimaryForm from "../UI/forms/PrimaryForm";

const LoginForm = function () {
  const usernameInputRef = useRef();
  const passwordInputRef = useRef();

  const submitHandler = function (e) {
    console.log(usernameInputRef.current.value);
    console.log(passwordInputRef.current.value);
    e.preventDefault();
  };
  return (
    <PrimaryForm className={classes["primary-form"]} onSubmit={submitHandler}>
      <h2>User Login</h2>
      <div className={classes["login-controls"]}>
        <FormField inputRef={usernameInputRef} type="text" name="email" />
        <FormField
          inputRef={passwordInputRef}
          type="password"
          name="password"
        />

        <SecondaryButton>Login</SecondaryButton>
      </div>

      <Link href="/login/reset-password">Forgot your password?</Link>
    </PrimaryForm>
  );
};

export default LoginForm;
