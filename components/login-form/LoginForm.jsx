import React, { useRef } from "react";
import SecondaryButton from "../UI/buttons/SecondaryButton";
import Link from "next/link";
import classes from "./LoginForm.module.scss";
import FormField from "./FormField";

export default function LoginForm() {
  const usernameInputRef = useRef();
  const passwordInputRef = useRef();

  const submitHandler = function (e) {
    console.log(usernameInputRef.current.value);
    console.log(passwordInputRef.current.value);
    e.preventDefault();
  };
  return (
    <div className={classes["form-container"]}>
      <form className={classes.form} onSubmit={submitHandler}>
        <h2>User Login</h2>
        <div className={classes["login-controls"]}>
          <FormField inputRef={usernameInputRef} type="text" name="username" />
          <FormField
            inputRef={passwordInputRef}
            type="password"
            name="password"
          />

          <SecondaryButton>Login</SecondaryButton>
        </div>

        <Link href="/login/reset-password">Forgot your password?</Link>
      </form>
    </div>
  );
}
