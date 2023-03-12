import React, { useRef, useState } from "react";
import SecondaryButton from "../UI/buttons/SecondaryButton";
import Link from "next/link";
import classes from "./LoginForm.module.scss";
import CustomField from "../UI/custom-fields/CustomField";
import PrimaryForm from "../UI/forms/PrimaryForm";
import EmailIcon from "../UI/svg/EmailIcon";
import PasswordIcon from "../UI/svg/PasswordIcon";
import FormMessage from "../UI/forms/form-message/FormMessage";
import { clearField, scrollToTop } from "../../utils";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import useAuth from "../../hooks/useAuth";
import InlineSpinner from "../UI/inline-spinner/InlineSpinner";

// This component uses a higher order component approach to protect this route from being accessed while logged in.
const LoginForm = function () {
  const user = useSelector((state) => state.auth.user);
  const router = useRouter();

  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [message, setMessage] = useState("");

  const auth = useAuth();
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
      await auth.login(email, password);
    } catch (error) {
      scrollToTop();
      setMessage(auth.formatErrorCode(error.message));
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
        <InlineSpinner color="#fff" />
      ) : (
        <SecondaryButton>Login</SecondaryButton>
      )}

      {message && <FormMessage message={message} onClick={clearMessage} />}

      <Link
        className={classes["forgot-password"]}
        href="/login/forgot-password"
      >
        Forgot your password?
      </Link>
    </PrimaryForm>
  );
};

export default LoginForm;
