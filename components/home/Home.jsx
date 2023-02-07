import React from "react";
import HomepageIllustration from "../UI/svg/HomepageIllustration";
import classes from "./Home.module.scss";
import Introduction from "./introduction/Introduction";
import LatestQuestions from "./latest-questions/LatestQuestions";
import FeedControlBar from "../feed/feed-control-bar/FeedControlBar";

const Home = function ({ latestQuestionsData }) {
  return (
    <div className={classes.home}>
      <FeedControlBar />
      <section className={classes.section1}>
        <Introduction />
        <HomepageIllustration className={classes.illustration} />
      </section>

      <section className={classes.section2}>
        <LatestQuestions latestQuestionsData={latestQuestionsData} />
      </section>
    </div>
  );
};

export default Home;
