import React from "react";
import classes from "./Footer.module.scss";
import HeartIcon from "../../svg/HeartIcon";
import PrimaryButton from "../../../UI/buttons/PrimaryButton";
import MadeWith from "../made-with/MadeWith";

const Footer = function () {
  return (
    <footer id="footer" className={classes.footer}>
      <div className={classes.link}>
        <h3>Liked my page? Visit my portfolio!</h3>
        <PrimaryButton href="https://www.omarmoquete.dev" target="_blank">
          omarmoquete.dev
        </PrimaryButton>
      </div>
      <div className={classes.technologies}>
        <MadeWith />
      </div>
      <div className={classes.cr}>
        <p>
          Handcrafted with
          <HeartIcon className={classes.heart} />
          In NY, USA. &#174; 2022 by Omar Moquete. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
