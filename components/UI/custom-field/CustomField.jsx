import React from "react";
import classes from "./CustomField.module.scss";

const CustomField = function (props) {
  // formats a string to url-friendly
  const format = (string) => string.toLowerCase().split(" ").join("-");

  const inputClassWithIcon = classes["input-with-icon"];
  const inputClassWithoutIcon = classes["input-without-icon"];
  // If no lable is provided, these attributes are not added
  const formAttributes = props.label
    ? {
        id: format(props.label),
        name: format(props.label),
      }
    : null;

  const placeholder = props.placeholder
    ? { placeholder: props.placeholder }
    : {};

  return (
    <div className={classes.field}>
      {props.label && (
        <label htmlFor={format(props.label)}>{props.label}</label>
      )}

      <div>
        {props.Icon && (
          <span>
            <props.Icon className={classes["form-svg"]} />
          </span>
        )}

        {/* If no icon is passed through props, a suitable class is applied. */}
        <input
          required={props?.required ?? false}
          className={props.Icon ? inputClassWithIcon : inputClassWithoutIcon}
          type={props?.type ?? "text"}
          ref={props.inputRef}
          {...(props.label ? formAttributes : {})}
          {...(props.placeholder ? placeholder : {})}
        />
      </div>
    </div>
  );
};

export default CustomField;
