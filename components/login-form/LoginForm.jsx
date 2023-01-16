import React, { useEffect, useRef, useState } from "react";
import SecondaryButton from "../UI/buttons/SecondaryButton";
import Link from "next/link";
import classes from "./LoginForm.module.scss";
import CustomField from "../UI/custom-field/CustomField";
import PrimaryForm from "../UI/forms/PrimaryForm";
import EmailIcon from "../UI/svg/EmailIcon";
import PasswordIcon from "../UI/svg/PasswordIcon";
import FormMessage from "../UI/forms/form-message/FormMessage";
import { clearField, formatFirebaseErrorCode, scrollToTop } from "../../utils";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import useAuth from "../../hooks/useAuth";
import { TailSpin } from "react-loader-spinner";
import FormButtonSpinner from "../UI/forms/form-button-spinner/FormButtonSpinner";

// This component uses a higher order component approach to protect this route from being accessed while logged in.
const LoginForm = function () {
  const { user, authStatus, authStatusNames } = useSelector(
    (state) => state.auth
  );
  const router = useRouter();

  const Component = () => {
    const emailInputRef = useRef();
    const passwordInputRef = useRef();
    const [message, setMessage] = useState("");

    const { login } = useAuth();
    const clearMessage = () => {
      if (message === "") return;
      else setMessage("");
    };

    // Controls loading spinner in submit component
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submitHandler = async function (e) {
      e.preventDefault();

      setIsSubmitting(true);

      try {
        const email = emailInputRef.current.value;
        const password = passwordInputRef.current.value;
        // signIn will automatically set state.user
        await login(email, password);
      } catch (error) {
        scrollToTop();
        setMessage(formatFirebaseErrorCode(error.message));
        clearField(passwordInputRef);
        setIsSubmitting(false);
      }
    };

    // Ensures that user gets redirected if submitting only.
    if (user !== null && isSubmitting) router.replace(`/${user.username}`);

    return (
      <PrimaryForm onSubmit={submitHandler}>
        <h2>Login</h2>
        <CustomField
          type="email"
          label="Email"
          placeholder="Enter your email"
          Icon={EmailIcon}
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

        {isSubmitting ? (
          <FormButtonSpinner />
        ) : (
          <SecondaryButton>Login</SecondaryButton>
        )}
        {message && <FormMessage message={message} onClick={clearMessage} />}

        <Link
          className={classes["forgot-password"]}
          href="/login/reset-password"
        >
          Forgot your password?
        </Link>
      </PrimaryForm>
    );
  };

  if (user) {
    router.replace("/" + user.username);
    // Should be fixed with suspense
    return (
      <>
        <h1>REDIRECTING...</h1>;<h1>REDIRECTING...</h1>;<h1>REDIRECTING...</h1>;
        <h1>REDIRECTING...</h1>;<h1>REDIRECTING...</h1>;<h1>REDIRECTING...</h1>;
        <h1>REDIRECTING...</h1>;<h1>REDIRECTING...</h1>;<h1>REDIRECTING...</h1>;
        <h1>REDIRECTING...</h1>;<h1>REDIRECTING...</h1>;<h1>REDIRECTING...</h1>;
        <h1>REDIRECTING...</h1>;<h1>REDIRECTING...</h1>;<h1>REDIRECTING...</h1>;
        <h1>REDIRECTING...</h1>;<h1>REDIRECTING...</h1>;<h1>REDIRECTING...</h1>;
        <h1>REDIRECTING...</h1>;<h1>REDIRECTING...</h1>;<h1>REDIRECTING...</h1>;
        <h1>REDIRECTING...</h1>;<h1>REDIRECTING...</h1>;<h1>REDIRECTING...</h1>;
        <h1>REDIRECTING...</h1>;<h1>REDIRECTING...</h1>;<h1>REDIRECTING...</h1>;
        <h1>REDIRECTING...</h1>;<h1>REDIRECTING...</h1>;<h1>REDIRECTING...</h1>;
        <h1>REDIRECTING...</h1>;<h1>REDIRECTING...</h1>;<h1>REDIRECTING...</h1>;
        <h1>REDIRECTING...</h1>;<h1>REDIRECTING...</h1>;<h1>REDIRECTING...</h1>;
        <h1>REDIRECTING...</h1>;<h1>REDIRECTING...</h1>;<h1>REDIRECTING...</h1>;
      </>
    );
  }
  if (!user) {
    return <Component />;
  }
};

export default LoginForm;
