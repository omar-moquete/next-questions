import React from "react";
import classes from "./CustomField.module.scss";

const CustomField = function ({
  type = "text",
  label,
  placeholder,
  Icon,
  inputRef,
  required = false,
  onChange,
  onFocus,
  onClick,
}) {
  // formats a string to url-friendly
  const format = (string) => string.trim().toLowerCase().split(" ").join("-");

  const inputClassWithIcon = classes["input-with-icon"];
  const inputClassWithoutIcon = classes["input-without-icon"];
  // Prevent attributes from being added to the input if they're not received through props
  const formAttributes = label
    ? {
        id: format(label),
        name: format(label),
      }
    : null;

  const placeholderOrNot = placeholder ? { placeholder } : {};
  const onChangeOrNot = onChange ? { onChange } : {};
  const onFocusOrNot = onFocus ? { onFocus } : {};
  const onClickOrNot = onClick ? { onClick } : {};

  return (
    <div className={classes.field}>
      {label && <label htmlFor={format(label)}>{label}</label>}

      <div>
        {Icon && (
          <span>
            <Icon className={classes["form-svg"]} />
          </span>
        )}

        {/* If no icon is passed through props, a suitable class is applied. */}
        <input
          required={required}
          className={Icon ? inputClassWithIcon : inputClassWithoutIcon}
          type={type}
          ref={inputRef}
          {...(label ? formAttributes : {})}
          {...(placeholder ? placeholderOrNot : {})}
          {...(onChange ? onChangeOrNot : {})}
          {...(onFocus ? onFocusOrNot : {})}
          {...(onClick ? onClickOrNot : {})}
        />
      </div>
    </div>
  );
};

export default CustomField;
