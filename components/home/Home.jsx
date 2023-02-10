import React from "react";
import HomepageIllustration from "../UI/svg/HomepageIllustration";
import classes from "./Home.module.scss";
import Introduction from "./introduction/Introduction";
import LatestQuestions from "./latest-questions/LatestQuestions";
import FeedControlBar from "../feed/feed-control-bar/FeedControlBar";
import { useRouter } from "next/router";

const Home = function ({ latestQuestionsData }) {
  const router = useRouter();
  const selectionInHomeComponentHandler = async (_, topicTitle) => {
    // route to feed with topic
    router.push(`/feed?topic=${topicTitle}`);
  };

  return (
    <div className={classes.home}>
      <FeedControlBar onSelect={selectionInHomeComponentHandler} />
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
