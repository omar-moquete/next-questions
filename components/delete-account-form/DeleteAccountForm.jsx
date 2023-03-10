import { useRouter } from "next/router";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { deleteUserData } from "../../db";
import useAuth from "../../hooks/useAuth";
import store from "../../redux-store/store";
import { formatFirebaseErrorCode, scrollToTop } from "../../utils";
import DeleteAccountButton from "../UI/buttons/DeleteAccountButton";
import SecondaryButton from "../UI/buttons/SecondaryButton";
import CustomField from "../UI/custom-fields/CustomField";
import FormMessage from "../UI/forms/form-message/FormMessage";
import PrimaryForm from "../UI/forms/PrimaryForm";
import PasswordIcon from "../UI/svg/PasswordIcon";
import WarningIcon from "../UI/svg/WarningIcon";
import classes from "./DeleteAccountForm.module.scss";

const DeleteAccountForm = function () {
  const checkboxInputRef = useRef();
  const router = useRouter();
  const { deleteUser } = useAuth();
  // Subscribing this component to the store is not needed, and since this route is protected, the user will always be truthy.
  const user = store.getState().auth.user;
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState("");
  const [message, setMessage] = useState("");

  const clearMessage = () => {
    if (message === "") return;
    else setMessage("");
  };

  const onCheckboxChange = (e) => {
    setDisclaimerAccepted(e.target.checked);
  };

  const onPasswordChange = (e) => {
    setEnteredPassword(e.target.value);
  };

  const onCancel = (e) => {
    e.preventDefault();
    router.back();
  };

  const onDeleteAccount = async (e) => {
    e.preventDefault();
    try {
      // deleteUser will automatically call logout the user
      await deleteUser(enteredPassword);
    } catch (error) {
      scrollToTop();
      // BUG: Call if contains firebase/auth in string
      console.log("error.message", error.message);
      setMessage(formatFirebaseErrorCode(error.message));
    }
  };

  return (
    <PrimaryForm onSubmit={onDeleteAccount}>
      <h2>Delete account</h2>

      <div>
        <p className={classes.p1}>We're sorry to see you go! </p>
        <div className={classes.warning}>
          <div className={classes.warningIconWrapper}>
            <WarningIcon />
          </div>
          <p className={classes.p2}>
            Before you continue, please note that in order to continue helping
            others, we cannot delete your questions or answers. However, your
            personal data will be permanently deleted. This action can not be
            undone.
          </p>

          <label className={classes.accept}>
            <input
              ref={checkboxInputRef}
              type="checkbox"
              onChange={onCheckboxChange}
              required
            />
            Accept
          </label>
        </div>
      </div>

      <CustomField
        label="Confirm password"
        placeholder="Enter your password"
        Icon={PasswordIcon}
        onChange={onPasswordChange}
        type="password"
        required
      />
      <div className={classes.btns}>
        <SecondaryButton type="button" onClick={onCancel}>
          Cancel
        </SecondaryButton>
        <DeleteAccountButton
          className={`${classes.deleteButton} ${
            disclaimerAccepted && enteredPassword
              ? classes.deleteButtonEnabled
              : ""
          }`}
        />
      </div>

      {message && <FormMessage message={message} onClick={clearMessage} />}
    </PrimaryForm>
  );
};

export default DeleteAccountForm;
