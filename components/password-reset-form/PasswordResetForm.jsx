import React, { useRef } from "react";
import SecondaryButton from "../UI/buttons/SecondaryButton";
import classes from "./PasswordResetForm.module.scss";
import PrimaryForm from "../UI/forms/PrimaryForm";
import CustomField from "../UI/custom-fields/CustomField";
import PasswordIcon from "../UI/svg/PasswordIcon";

const PasswordResetForm = function () {
  const usernameInputRef = useRef();
  const passwordInputRef = useRef();

  const submitHandler = function (e) {
    e.preventDefault();
  };
  return (
    <PrimaryForm className={classes["primary-form"]} onCLick={submitHandler}>
      <h2>Create a new password</h2>
      <CustomField
        inputRef={usernameInputRef}
        type="password"
        name="email"
        placeholder="New password"
        Icon={PasswordIcon}
      />
      <SecondaryButton>Submit</SecondaryButton>
    </PrimaryForm>
  );
};

export default PasswordResetForm;
