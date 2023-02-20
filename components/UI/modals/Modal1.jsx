import React from "react";
import SecondaryButton from "../buttons/SecondaryButton";
import classes from "./Modal1.module.scss";

const Modal1 = function ({ title, paragraphs, buttons, children }) {
  // buttons = [{
  // text
  // onClick: fn
  // }]

  return (
    <div className={classes.overlay}>
      <div className={classes.modal}>
        <h2>{title}</h2>
        {paragraphs && paragraphs.map((p, i) => <p key={i}>{p}</p>)}

        {children}

        {buttons &&
          buttons.map((button) => (
            <SecondaryButton
              key={button.text}
              onClick={button.onClick || (() => {})}
            >
              {button.text}
            </SecondaryButton>
          ))}
      </div>
    </div>
  );
};

export default Modal1;
