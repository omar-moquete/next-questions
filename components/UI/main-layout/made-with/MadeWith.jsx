import React from "react";
import FirebaseIcon from "../../svg/FirebaseIcon";
import JavaScriptIcon from "../../svg/JavaScriptIcon";
import NextjsIcon from "../../svg/NextjsIcon";
import ReactIcon from "../../svg/ReactIcon";
import ReduxIcon from "../../svg/ReduxIcon";
import SassIcon from "../../svg/SassIcon";
import classes from "./MadeWith.module.scss";

const MadeWith = function () {
  return (
    <div className={classes.container} translate="no">
      <h3 translate="yes">Made with</h3>
      <ul>
        <li>
          <JavaScriptIcon /> JavaScript
        </li>
        <li>
          <NextjsIcon />
          Next.js
        </li>
        <li>
          <ReactIcon />
          React.js
        </li>
        <li>
          <ReduxIcon />
          Redux
        </li>
        <li>
          <SassIcon />
          Sass
        </li>
        <li>
          <FirebaseIcon />
          Firebase
        </li>
      </ul>
    </div>
  );
};

export default MadeWith;
