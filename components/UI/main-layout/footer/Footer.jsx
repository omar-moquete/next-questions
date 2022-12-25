import React from "react";
import classes from "./Footer.module.scss";
import HeartIcon from "../../svg/HeartIcon";
import PrimaryButton from "../../../UI/buttons/PrimaryButton";

const Footer = function () {
  return (
    <div className={classes.footer}>
      <div className={classes.link}>
        <h3>Liked my page? Visit my portfolio!</h3>
        <PrimaryButton href="https://www.omarmoquete.dev" target="_blank">
          omarmoquete.dev
        </PrimaryButton>
      </div>
      <div className={classes.cr}>
        <p>
          Handcrafted with
          <HeartIcon />
          In NY, USA. &#174; 2022 by Omar Moquete. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
