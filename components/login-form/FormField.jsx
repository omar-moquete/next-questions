import React from "react";
import UserIcon from "../UI/svg-icons/UserIcon";
import PasswordIcon from "../UI/svg-icons/PasswordIcon";
import classes from "./FormField.module.scss";

export default function FormField(props) {
  return (
    <div className={classes.field}>
      <label htmlFor="password">password</label>
      <div>
        <span>
          {props.name === "username" && (
            <UserIcon className={classes["form-svg"]} />
          )}

          {props.name === "password" && (
            <PasswordIcon className={classes["form-svg"]} />
          )}
        </span>
        <input
          type={props.type}
          id={props.name}
          name={props.name}
          placeholder={`Enter your ${props.name}`}
          ref={props.inputRef}
        />
      </div>
    </div>
  );
}
