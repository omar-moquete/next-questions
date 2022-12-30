import React, { useRef } from "react";
import SecondaryButton from "../UI/buttons/SecondaryButton";
import Link from "next/link";
import classes from "./LoginForm.module.scss";
import CustomField from "../UI/custom-field/CustomField";
import PrimaryForm from "../UI/forms/PrimaryForm";

import UserIcon from "../UI/svg/UserIcon";
import PasswordIcon from "../UI/svg/PasswordIcon";

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
        <CustomField
          type="text"
          label="Email"
          placeholder="Enter your email"
          Icon={UserIcon}
          inputRef={usernameInputRef}
        />
        <CustomField
          type="password"
          label="Password"
          placeholder="Enter your password"
          Icon={PasswordIcon}
          inputRef={passwordInputRef}
        />

        <SecondaryButton>Login</SecondaryButton>
      </div>

      <Link href="/login/reset-password">Forgot your password?</Link>
    </PrimaryForm>
  );
};

export default LoginForm;
