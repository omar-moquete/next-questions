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
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import useAuth from "../../hooks/useAuth";
import { TailSpin } from "react-loader-spinner";

const LoginForm = function () {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [message, setMessage] = useState("");
  const { user, authStatus, authStatusNames } = useSelector(
    (state) => state.auth
  );

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

  const test = function () {
    const condition = authStatus === authStatusNames.checking;
    if (condition) {
      return (
        <TailSpin
          height="50"
          width="50"
          color="#fff"
          ariaLabel="tail-spin-loading"
          radius="1"
          visible={true}
          wrapperClass={classes.spinner}
        />
      );
    }
  };

  return (
    <PrimaryForm onSubmit={submitHandler}>
      <h2>Login</h2>
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
      {message && <FormMessage message={message} onClick={clearMessage} />}

      <Link className={classes["forgot-password"]} href="/login/reset-password">
        Forgot your password?
      </Link>
    </PrimaryForm>
  );
};

export default LoginForm;
