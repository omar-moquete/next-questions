import React from "react";
import classes from "./FormMessage.module.scss";

const FormMessage = function (props) {
  return (
    <div className={`${classes.messages} ${props.className}`}>
      <p>{props.message}</p>
    </div>
  );
};

export default FormMessage;
