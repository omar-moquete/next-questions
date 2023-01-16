import React, { useRef, useState } from "react";
import classes from "./PasswordChangeForm.module.scss";
import PrimaryForm from "../UI/forms/PrimaryForm";
import CustomField from "../UI/custom-field/CustomField";
import SecondaryButton from "../UI/buttons/SecondaryButton";
import PasswordIcon from "../UI/svg/PasswordIcon";
import FormMessage from "../UI/forms/form-message/FormMessage";
import {
  INVALID_PASSWORD_MESSAGE,
  PASSWORDS_DO_NOT_MATCH_MESSAGE,
  PASSWORD_VALIDATION_REGEX,
} from "../../app-config";
import { clearField, formatFirebaseErrorCode } from "../../utils";
import useAuth from "../../hooks/useAuth";
import { useRouter } from "next/router";
import FormButtonSpinner from "../UI/forms/form-button-spinner/FormButtonSpinner";
import CheckIcon from "../UI/svg/CheckIcon";

const PasswordChangeForm = function () {
  const [message, setMessage] = useState("");
  const oldPasswordRef = useRef();
  const newPasswordRef = useRef();
  const confirmPasswordRef = useRef();
  const clearMessage = () => setMessage("");
  const { changePassword } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    // Password validation

    // Validate password format
    if (!PASSWORD_VALIDATION_REGEX.test(newPasswordRef.current.value)) {
      setMessage(INVALID_PASSWORD_MESSAGE);
      clearField(oldPasswordRef);
      clearField(newPasswordRef);
      clearField(confirmPasswordRef);
      return;
    }

    // Verify if passwords match
    if (confirmPasswordRef.current.value !== newPasswordRef.current.value) {
      setMessage(PASSWORDS_DO_NOT_MATCH_MESSAGE);
      clearField(oldPasswordRef);
      clearField(newPasswordRef);
      clearField(confirmPasswordRef);
      return;
    }

    try {
      setIsSubmitting(true);
      await changePassword(
        oldPasswordRef.current.value,
        newPasswordRef.current.value
      );
      setIsSubmitting(false);
      setPasswordChanged(true);

      // If change succeeeded, redirect user.
      // Wait two seconds to ensure notification is noticed
      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (e) {
      clearField(oldPasswordRef);
      clearField(newPasswordRef);
      clearField(confirmPasswordRef);
      setMessage(formatFirebaseErrorCode(e.message));
      setIsSubmitting(false);
    }
  };

  return (
    <PrimaryForm onSubmit={submitHandler}>
      <h2>Create a new password</h2>
      <CustomField
        type="password"
        label="Old password"
        placeholder="Enter your old password"
        Icon={PasswordIcon}
        inputRef={oldPasswordRef}
        onChange={clearMessage}
        required
      />
      <CustomField
        type="password"
        label="New password"
        placeholder="Enter your new password"
        Icon={PasswordIcon}
        inputRef={newPasswordRef}
        onChange={clearMessage}
        required
      />
      <CustomField
        type="password"
        label="Confirm new password"
        placeholder="Reenter your new password"
        Icon={PasswordIcon}
        inputRef={confirmPasswordRef}
        onChange={clearMessage}
        required
      />

      {isSubmitting && passwordChanged === false && <FormButtonSpinner />}
      {!isSubmitting && passwordChanged === false && (
        <SecondaryButton>Update password</SecondaryButton>
      )}
      {/* If the password was changed, notify the user */}
      {passwordChanged === true && <CheckIcon className={classes.check} />}

      {message && <FormMessage message={message} onClick={clearMessage} />}
    </PrimaryForm>
  );
};

export default PasswordChangeForm;
