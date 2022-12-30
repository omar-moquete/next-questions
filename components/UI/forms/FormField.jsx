import React from "react";
import UserIcon from "../svg/UserIcon";
import PasswordIcon from "../svg/PasswordIcon";
import classes from "./FormField.module.scss";

const FormField = function (props) {
  return (
    <div className={classes.field}>
      {props.name === "email" && <label htmlFor="email">Email</label>}
      {props.name === "password" && <label htmlFor="password">Password</label>}
      <div>
        <span>
          {props.name === "email" && (
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
          placeholder={props.name ? `Enter your ${props.name}` : ""}
          ref={props.inputRef}
          {...props}
        />
      </div>
    </div>
  );
};

export default FormField;
