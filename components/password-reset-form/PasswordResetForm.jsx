import React, { useRef } from "react";
import SecondaryButton from "../UI/buttons/SecondaryButton";
import classes from "./PasswordResetForm.module.scss";
import PrimaryForm from "../UI/forms/PrimaryForm";
import CustomField from "../UI/custom-fields/CustomField";
import EmailIcon from "../UI/svg/EmailIcon";
import Portal from "../UI/Portal";
import Modal1 from "../UI/modals/Modal1";
import { useState } from "react";
import { useRouter } from "next/router";
import useAuth from "../../hooks/useAuth";
import { EMAIL_VALIDATION_REGEX } from "../../app-config";
import FormMessage from "../UI/forms/form-message/FormMessage";

const PasswordResetForm = function () {
  const passwordInputRef = useRef();
  const router = useRouter();
  const auth = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  const submitHandler = function (e) {
    e.preventDefault();
    const email = passwordInputRef.current.value;
    if (EMAIL_VALIDATION_REGEX.test(email)) {
      auth.sendPasswordResetEmail(email);
      setMessage("");
      setShowModal(true);
    } else {
      setMessage("The entered email is invalid.");
    }
  };
  return (
    <PrimaryForm className={classes["primary-form"]} onSubmit={submitHandler}>
      <Portal show={showModal}>
        <Modal1
          title="Check your inbox"
          paragraphs={[
            "We'll send you an email if we find an account associated with this email address. Check your inbox!",
          ]}
          buttons={[
            {
              text: "Homepage",
              onClick: () => {
                router.replace("/");
              },
            },
          ]}
        />
      </Portal>
      <h2>Reset your password</h2>
      <CustomField
        inputRef={passwordInputRef}
        type="text"
        name="email"
        placeholder="Enter your email address"
        Icon={EmailIcon}
        label="Email"
        required
      />
      <SecondaryButton>Submit</SecondaryButton>

      {message && <FormMessage message={message} />}
    </PrimaryForm>
  );
};

export default PasswordResetForm;
