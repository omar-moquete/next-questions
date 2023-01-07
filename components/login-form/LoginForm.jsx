import React, { useRef, useState } from "react";
import SecondaryButton from "../UI/buttons/SecondaryButton";
import Link from "next/link";
import classes from "./LoginForm.module.scss";
import CustomField from "../UI/custom-field/CustomField";
import PrimaryForm from "../UI/forms/PrimaryForm";
import UserIcon from "../UI/svg/UserIcon";
import PasswordIcon from "../UI/svg/PasswordIcon";
import FormMessage from "../UI/forms/form-message/FormMessage";
import { clearField, formatFirebaseErrorCode } from "../../utils";
import { AUTH_ENDPOINT } from "../../backend-apis";
import { useRouter } from "next/router";

const LoginForm = function () {
  //
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [message, setMessage] = useState("");
  //
  const router = useRouter();

  const clearMessage = () => {
    if (message === "") return;
    else setMessage("");
  };

  const submitHandler = async function (e) {
    e.preventDefault();

    const email = emailInputRef.current.value;
    const password = passwordInputRef.current.value;

    try {
      const response = await fetch(AUTH_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const responseData = await response.json();

      if (response.ok) {
        // set app state user data
        // router.replace("/" + responseData.uid);
      } else throw new Error(responseData);
    } catch (error) {
      setMessage(formatFirebaseErrorCode(error.message));
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
          onChange={clearMessage}
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
      {message && <FormMessage message={message} onClick={clearMessage} />}

      <Link href="/login/reset-password">Forgot your password?</Link>
    </PrimaryForm>
  );
};

export default LoginForm;
