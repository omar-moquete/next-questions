import React, { useRef, useState } from "react";
import CustomField from "../UI/custom-field/CustomField";
import classes from "./SignupForm.module.scss";
import PrimaryForm from "../UI/forms/PrimaryForm";
import SecondaryButton from "../UI/buttons/SecondaryButton";
import { clearField, isValidPassword } from "../../utils";
import FormMessage from "../UI/forms/form-message/FormMessage";
import {
  PASSWORD_DOES_NOT_MATCH_MESSAGE,
  PASSWORD_INVALID_MESSAGE,
} from "../../app-config";
import { useRouter } from "next/router";

const SignupForm = function () {
  const emailInputRef = useRef();
  const usernameInputRef = useRef();
  const password1InputRef = useRef();
  const password2InputRef = useRef();
  const [message, setMessage] = useState("");
  const [isFormValidated, setIsFormValidated] = useState(false);

  const clearMessage = () => {
    if (message === "") return;
    else setMessage("");
  };

  const submitHandler = function (e) {
    e.preventDefault();

    const email = emailInputRef.current.value;
    const username = usernameInputRef.current.value;
    const password1 = password1InputRef.current.value;
    const password2 = password2InputRef.current.value;

    // Check if email is being used

    // Check if username exists

    // Check if password is valid
    if (!isValidPassword(password1)) {
      clearField(password2InputRef);
      setMessage(PASSWORD_INVALID_MESSAGE);
    }

    // Check if passwords are the same
    if (password1 !== password2) {
      clearField(password2InputRef);
      setMessage(PASSWORD_DOES_NOT_MATCH_MESSAGE);
    }

    // If checks are passed, create new user and setIsFormValidated(true)

    // if isFormValidated, set authState and Navigate user to profile

    if (isFormValidated) {
      // profile must be username
      useRouter().push("/username");
    }
  };

  return (
    <PrimaryForm className={classes.form} onSubmit={submitHandler}>
      <h2>User signup</h2>
      <CustomField
        type="email"
        label="Email"
        placeholder="Enter your email"
        inputRef={emailInputRef}
        required
        onChange={clearMessage}
      />
      <CustomField
        type="text"
        label="Username"
        placeholder="Enter new username"
        inputRef={usernameInputRef}
        required
        onChange={clearMessage}
      />
      <CustomField
        type="password"
        label="Password"
        placeholder="Enter a password"
        inputRef={password1InputRef}
        required
        onChange={clearMessage}
      />
      <CustomField
        type="password"
        label="Confirm password"
        placeholder="Enter same password"
        inputRef={password2InputRef}
        required
        onChange={clearMessage}
      />
      <SecondaryButton className={classes.btn}>Signup</SecondaryButton>

      {message && <FormMessage message={message} />}
    </PrimaryForm>
  );
};

export default SignupForm;
