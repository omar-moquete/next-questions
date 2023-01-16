import React, { useRef } from "react";
import SecondaryButton from "../UI/buttons/SecondaryButton";
import classes from "./PasswordResetForm.module.scss";
import PrimaryForm from "../UI/forms/PrimaryForm";
import FormField from "../UI/forms/FormField";

const LoginForm = function () {
  const usernameInputRef = useRef();
  const passwordInputRef = useRef();

  const submitHandler = function (e) {
    console.log(usernameInputRef.current.value);
    console.log(passwordInputRef.current.value);
    e.preventDefault();
  };
  return (
    // <PrimaryForm className={classes["primary-form"]} onCLick={submitHandler}>
    //   <h2>Create a new password</h2>
    //   <FormField inputRef={usernameInputRef} type="text" name="email" />
    //   <SecondaryButton>Submit</SecondaryButton>
    // </PrimaryForm>
    ""
  );
};

export default LoginForm;
