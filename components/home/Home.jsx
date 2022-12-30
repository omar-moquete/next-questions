import React from "react";
import HomepageIllustration from "../UI/svg/HomepageIllustration";
import classes from "./Home.module.scss";
import Introduction from "./introduction/Introduction";
import LatestQuestions from "./latest-questions/LatestQuestions";
const Home = function () {
  return (
    <div className={classes.home}>
      <section className={classes.section1}>
        <Introduction />
        <HomepageIllustration />
      </section>

      <section className={classes.section2}></section>
      <LatestQuestions />
    </div>
  );
};

export default Home;
