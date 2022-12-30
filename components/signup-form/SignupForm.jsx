import React from "react";
import CustomField from "../UI/custom-field/CustomField";
import classes from "./SignupForm.module.scss";
import PrimaryForm from "../UI/forms/PrimaryForm";
import SecondaryButton from "../UI/buttons/SecondaryButton";

const SignupForm = function (props) {
  return (
    <PrimaryForm className={classes.form}>
      <h2>User signup</h2>
      <CustomField required label="Email" placeholder="Enter your email" />
      <CustomField required label="Username" placeholder="Enter new username" />
      <CustomField
        required
        label="Password"
        type="password"
        placeholder="Enter a password"
      />
      <CustomField
        required
        label="Confirm password"
        type="password"
        placeholder="Enter same password"
      />

      <SecondaryButton className={classes.btn}>Signup</SecondaryButton>
    </PrimaryForm>
  );
};

export default SignupForm;
