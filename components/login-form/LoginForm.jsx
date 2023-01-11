import React, { useEffect, useRef, useState } from "react";
import SecondaryButton from "../UI/buttons/SecondaryButton";
import Link from "next/link";
import classes from "./LoginForm.module.scss";
import CustomField from "../UI/custom-field/CustomField";
import PrimaryForm from "../UI/forms/PrimaryForm";
import UserIcon from "../UI/svg/UserIcon";
import PasswordIcon from "../UI/svg/PasswordIcon";
import FormMessage from "../UI/forms/form-message/FormMessage";
import { clearField, formatFirebaseErrorCode, scrollToTop } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { authActions, signIn } from "../../redux-store/authSlice";
import { useRouter } from "next/router";
import useAuth from "../../hooks/useAuth";
import { AuthErrorCodes } from "firebase/auth";

const LoginForm = function () {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [message, setMessage] = useState("");
  const user = useSelector((state) => state.auth.user);
  const router = useRouter();
  const { login } = useAuth();
  const clearMessage = () => {
    if (message === "") return;
    else setMessage("");
  };

  const submitHandler = async function (e) {
    e.preventDefault();

    try {
      const email = emailInputRef.current.value;
      const password = passwordInputRef.current.value;
      // signIn will automatically set state.user
      await login(email, password);
    } catch (error) {
      scrollToTop();

      setMessage(formatFirebaseErrorCode(error.message));
      clearField(passwordInputRef);
    }
  };

  useEffect(() => {
    if (user) {
      // when state.user is changed by signIn()
      router.replace(`/${user.username}`);
    }
  }, [user]);

  return (
    <PrimaryForm className={classes["primary-form"]} onSubmit={submitHandler}>
      <h2>Login</h2>
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
