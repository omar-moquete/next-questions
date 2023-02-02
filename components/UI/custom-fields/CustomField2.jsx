import React from "react";
import { useEffect } from "react";
import { forwardRef } from "react";
import { useState } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";
import classes from "./CustomField2.module.scss";

const CustomField2 = forwardRef(function (
  {
    label,
    minRows = 1,
    type = "text",
    placeholder = "",
    required = false,
    name = "",
    className,
    disabled = false,
  },
  ref
) {
  return (
    <div className={`${classes.default} ${className}`}>
      {label && <label>{label}</label>}

      <ReactTextareaAutosize
        minRows={minRows}
        type={type}
        name={name}
        placeholder={placeholder}
        ref={ref}
        required={required}
        disabled={disabled}
      />
    </div>
  );
});

export default CustomField2;
