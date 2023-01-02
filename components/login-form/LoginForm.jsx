import React, { useRef, useState } from "react";
import SecondaryButton from "../UI/buttons/SecondaryButton";
import Link from "next/link";
import classes from "./LoginForm.module.scss";
import CustomField from "../UI/custom-field/CustomField";
import PrimaryForm from "../UI/forms/PrimaryForm";
import UserIcon from "../UI/svg/UserIcon";
import PasswordIcon from "../UI/svg/PasswordIcon";
import { INVALID_PASSWORD_MESSAGE } from "../../app-config";
import FormMessage from "../UI/forms/form-message/FormMessage";
import { clearField, isValidPassword } from "../../utils";

const LoginForm = function () {
  //
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [message, setMessage] = useState("");

  const clearMessage = () => {
    if (message === "") return;
    else setMessage("");
  };

  const submitHandler = async function (e) {
    e.preventDefault();

    const email = emailInputRef.current.value;
    const password = passwordInputRef.current.value;

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const responseBody = await response.json();
    } catch (error) {
      console.warn(error);
      setMessage(error.message);
      clearField(passwordInputRef);
    }
  };

  return (
    <PrimaryForm className={classes["primary-form"]} onSubmit={submitHandler}>
      <h2>User Login</h2>
      <div className={classes["login-controls"]}>
        <CustomField
          type="email"
          label="Email"
          placeholder="Enter your email"
          Icon={UserIcon}
          inputRef={emailInputRef}
          required
        />
        <CustomField
          type="password"
          label="Password"
          placeholder="Enter your password"
          Icon={PasswordIcon}
          inputRef={passwordInputRef}
          onChange={clearMessage}
          required
        />

        <SecondaryButton>Login</SecondaryButton>
      </div>
      {message && <FormMessage message={message} />}

      <Link href="/login/reset-password">Forgot your password?</Link>
    </PrimaryForm>
  );
};

export default LoginForm;
