import React, { useState } from "react";
import classes from "./MyFeedInfo.module.scss";
import QuestionIcon from "../../UI/svg/QuestionIcon";
import TopicItem from "./TopicItem";
import HashIcon from "../../UI/svg/HashIcon";

const MyFeedInfo = function () {
  const moreHandler = () => {
    // [ ]Todo: Show all favorite topics on click
  };
  return (
    <div className={classes.main}>
      <div className={classes.info}>
        <h3>My feed </h3>
        <div className={classes.stats}>
          <div className={classes.stat}>
            <HashIcon />
            <p className={classes.total}>23</p>
          </div>
          <div className={classes.stat}>
            <QuestionIcon />
            <p className={classes.total}>23</p>
          </div>
        </div>
      </div>

      <div className={`${classes.topics} ${classes.small}`}>
        <TopicItem uid="test" text="Cars" />
        <TopicItem uid="test" text="SantoDomingo" />
        <TopicItem uid="test" text="DominicanRepublic" />
        <TopicItem uid="test" text="WhiteHouse" />
        <TopicItem uid="test" text="President" />
        <TopicItem uid="test" text="p" />
        <TopicItem uid="test" text="Pent" />
        <TopicItem uid="test" text="Jobs" />
      </div>
      <label className={classes.more} onClick={moreHandler}>
        See all
      </label>
    </div>
  );
};

export default MyFeedInfo;
