import React, { useEffect, useState } from "react";

import classes from "./Home.module.scss";
import Introduction from "./introduction/Introduction";
import LatestQuestions from "./latest-questions/LatestQuestions";
import FeedControlBar from "../feed-control-bar/FeedControlBar";
import { useRouter } from "next/router";
import { getLatestQuestions } from "../../db";
import HomepageIllustration from "../UI/svg/HomepageIllustration";
import Tooltip1 from "../UI/tooltips/Tooltip1";
import { useSelector } from "react-redux";

const Home = function () {
  const router = useRouter();
  const selectionInHomeComponentHandler = async (_, topicTitle) => {
    // route to feed with topic
    router.push(`/feed?topic=${topicTitle}`);
  };

  const [showTooltip, setShowTooltip] = useState(true);

  const user = useSelector((slices) => slices.auth.user);

  const [latestQuestionsData, setLatestQuestionsData] = useState(null);

  // Next JS Will render a loader icon during build and this loader icon will be replaced by the data being fetched after hydration.
  useEffect(() => {
    (async () => {
      const latestQuestions = await getLatestQuestions(7);
      latestQuestions.sort((a, b) => {
        if (a.unixTimestamp > b.unixTimestamp) return -1;
        if (a.unixTimestamp < b.unixTimestamp) return 1;
        return 0;
      });
      setLatestQuestionsData(latestQuestions);
    })();
  }, []);

  const onTooltipClose = () => {
    setShowTooltip(false);
  };

  useEffect(() => {
    return () => {
      const seen = Boolean(localStorage.getItem("tooltipSeen"));

      if (!seen) localStorage.setItem("tooltipSeen", true);

      if (seen) setShowTooltip(false);
    };
  }, []);

  return (
    <div className={classes.home}>
      {showTooltip && user && (
        <Tooltip1 text="Checkout your feed!" onClose={onTooltipClose} />
      )}
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
