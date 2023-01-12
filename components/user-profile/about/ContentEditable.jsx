import React from "react";
import classes from "./ContentEditable.module.scss";

const ContentEditable = React.forwardRef(function (props, ref) {
  return (
    <div
      className={classes.inputarea}
      contentEditable
      ref={ref}
      placeholder="Start typing..."
      suppressContentEditableWarning={true}
    >
      {props.children}
    </div>
  );
});

export default ContentEditable;
