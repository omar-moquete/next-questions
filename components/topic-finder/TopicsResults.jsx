import React, { useState } from "react";
import classes from "./TopicsResults.module.scss";
import QuestionIcon from "../UI/svg/QuestionIcon";
import { bindArgs } from "../../utils";

import Highlight from "./Highlight";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { globalActions } from "../../redux-store/globalSlice";
import Link from "next/link";

// [ ]TODO: Add author to topic results

const TopicResults = function ({ topics, query, unmount, onSelect, inputRef }) {
  const router = useRouter();
  const dispatch = useDispatch();

  // 1) set selected topic to state
  const handleSelectedTopic = (topicUid, topicText) => {
    // Set input to selected topic

    inputRef.current.value = topicText;

    onSelect(topicUid);
    // Dismount this element after a selection was made
    unmount();
  };

  return (
    <ul className={classes.results}>
      {router.asPath.split("?")[0] === "/new-question" && (
        <li className={classes["new-topic"]}>
          <div>
            <h3>
              Create new topic: <span>#{query}</span>.
            </h3>
          </div>
        </li>
      )}

      {topics.length < 1 && router.asPath.split("?")[0] === "/feed" && (
        <li className={classes["no-questions"]}>
          <Link
            href={{
              pathname: "/new-question",
              query: { query },
            }}
          >
            <h3>
              No questions listed for <span>#{query}</span>. Click here to start
              this topic with a question.
            </h3>
          </Link>
        </li>
      )}
      {topics.map((topic) => (
        <li
          key={topic.uid}
          onClick={bindArgs(handleSelectedTopic, topic.uid, topic.text)}
        >
          <div className={classes.text}>
            <h3>
              <span>#</span>
              {/* 
              typed query: "carr", length = 4
              topic result: CarRepairs
              substring from 0 which is "C" to query length which is 4 = 
                      01234 + ...
              output: CarR + epairs   

          highlight(CarR) +  topic.text.substring(query.length)(epairs)         
              */}
              <Highlight value={topic.text.substring(0, query.length)} />
              {topic.text.substring(query.length)}
            </h3>
            <p>{topic.description}</p>
          </div>
          <div className={classes["total-questions-wrapper"]}>
            <div className={classes["total-questions"]}>
              <QuestionIcon /> <span>{topic.questionsAsked.length}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TopicResults;
