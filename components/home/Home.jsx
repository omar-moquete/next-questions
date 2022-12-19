import React from "react";
import HomepageIllustration from "../UI/svg/HomepageIllustration";
import classes from "./Home.module.scss";
import Introduction from "./introduction/Introduction";

const Home = function () {
  return (
    <div className={classes.home}>
      <Introduction />
      <HomepageIllustration />
    </div>
  );
};

export default Home;
