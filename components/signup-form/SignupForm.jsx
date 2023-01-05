import React, { useRef, useState } from "react";
import CustomField from "../UI/custom-field/CustomField";
import classes from "./SignupForm.module.scss";
import PrimaryForm from "../UI/forms/PrimaryForm";
import SecondaryButton from "../UI/buttons/SecondaryButton";
import { clearField, isValidPassword } from "../../utils";
import FormMessage from "../UI/forms/form-message/FormMessage";
import {
  EMAIL_VALIDATION_REGEX,
  PASSWORDS_DO_NOT_MATCH_MESSAGE,
  USERNAME_MAX_CHARACTERS,
  USERNAME_MIN_CHARACTERS,
} from "../../app-config";
import { useRouter } from "next/router";
import {
  EMAIL_EXISTS_URL,
  SIGNUP_URL,
  USERNAME_EXISTS_URL,
} from "../../backend-apis";
import { collection, doc, getDoc, query, where } from "firebase/firestore";
import { initializeApp } from "firebase/app";

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

  const checkIfEmailExists = async () => {
    // Ensures message is cleared on email field change
    clearMessage();
    const email = emailInputRef.current.value;
    // Ensure test only happens when user finishes typing a correct email address
    if (!EMAIL_VALIDATION_REGEX.test(email)) return;

    // Check if email address exists in db.
    try {
      const res = await fetch(EMAIL_EXISTS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const responseData = await res.json();

      if (res.ok) {
        console.log("ok");
      } else {
        throw new Error(responseData.message);
      }
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  const checkIfUsernameExists = async () => {
    clearMessage();
    const username = usernameInputRef.current.value;

    // Username validation
    if (
      !(
        username.length > USERNAME_MIN_CHARACTERS &&
        username.length <= USERNAME_MAX_CHARACTERS
      )
    )
      return;

    // Check if username address exists in db.
    try {
      const res = await fetch(USERNAME_EXISTS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      const responseData = await res.json();

      if (res.ok) {
        console.log("ok");
      } else {
        throw new Error(responseData.message);
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  const submitHandler = async function (e) {
    e.preventDefault();

    const email = emailInputRef.current.value;
    const username = usernameInputRef.current.value;
    const password1 = password1InputRef.current.value;
    const password2 = password2InputRef.current.value;

    // Check if email is a valid email address
    if (!EMAIL_VALIDATION_REGEX.test(email)) {
      setMessage(`The email address "${email}" is not a valid email address.`);
      return;
    }

    // Check if username is a valid username

    if (
      !(
        username.length >= USERNAME_MIN_CHARACTERS &&
        username.length <= USERNAME_MAX_CHARACTERS
      )
    ) {
      setMessage(`The username "${username}" is not a valid username.`);

      return;
    }

    // Check if username is valid
    if (!(username.length > 4 && username.length < 16)) return;
    if (!isValidPassword(password1)) {
      // Check if password is valid
      clearField(password2InputRef);
    }

    // Check if passwords are the same
    else if (password1 !== password2) {
      console.log("tessst");
      clearField(password2InputRef);
      setMessage(PASSWORDS_DO_NOT_MATCH_MESSAGE);
    }

    // If checks are passed, create new user and setIsFormValidated(true)
    // if (isFormValidated) {
    //   const res = await fetch(SIGNUP_URL, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({email, password1}),
    //   });
    // }

    // if isFormValidated, set authState and Navigate user to profile

    // if (isFormValidated) {
    //   // profile must be username
    //   useRouter().push("/username");
    // }

    //==================
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
        onChange={checkIfEmailExists}
      />
      <CustomField
        type="text"
        label="Username"
        placeholder="Enter new username"
        inputRef={usernameInputRef}
        required
        onChange={checkIfUsernameExists}
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
