import React from "react";
import classes from "./TopicsResults.module.scss";
import QuestionIcon from "../UI/svg/QuestionIcon";
import { bindArgs } from "../../utils";
import Highlight from "./Highlight";
import { useRouter } from "next/router";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { globalActions } from "../../redux-store/globalSlice";

const TopicResults = function ({
  topics,
  query,
  unmount,
  onSelect,
  onNewTopic,
  inputRef,
  setQuery,
  searchingTopic,
  resetSearchBar,
  isTopicValid,
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  // 1) set selected topic to state
  const handleSelectedTopic = (topicUid, topicTitle) => {
    // Set input to selected topic

    dispatch(globalActions.resetSearchParam());
    resetSearchBar && resetSearchBar();
    inputRef.current.value = topicTitle;
    setQuery(topicTitle);
    onSelect && onSelect(topicUid, topicTitle);

    // Dismount this element after a selection was made
    unmount();
  };

  // Can forward topic if /feed or /. This prevents topic suggestion message from appearing in pages where it's not wanted.
  const path = router.asPath.split("?")[0];
  const canForwardTopic = path === "/feed" || path === "/";

  return (
    <ul className={classes.results}>
      {!isTopicValid && (
        <li className={classes.invalidTopic}>
          <div>
            <h3>Topics cannot contain spaces or special characters.</h3>
            <p>
              Example: <span translate="no">#TheBeatles</span>
            </p>
          </div>
        </li>
      )}

      {router.asPath.split("?")[0] === "/new-question" &&
        topics.every(
          (topic) =>
            topic.title.trim().toLowerCase() !== query.trim().toLowerCase()
        ) &&
        isTopicValid && (
          <li
            className={classes["new-topic"]}
            onClick={() => {
              onNewTopic(query);
            }}
          >
            <div>
              <h3>
                Create new topic: <span>#{query}</span>.
              </h3>
            </div>
          </li>
        )}

      {canForwardTopic &&
        topics.length === 0 &&
        !searchingTopic &&
        isTopicValid && (
          <li className={classes["no-questions"]}>
            <Link
              href={{
                pathname: "/new-question",
                query: { query },
              }}
            >
              <h3>
                No questions listed for <span>#{query}</span>. Click here to
                start this topic with a question.
              </h3>
            </Link>
          </li>
        )}

      {isTopicValid &&
        topics.map((topic) => (
          <li
            key={topic.uid}
            onClick={bindArgs(handleSelectedTopic, topic.uid, topic.title)}
          >
            <div className={classes.text}>
              <h3 translate="no">
                <span>#</span>
                {/* 
              typed query: "carr", length = 4
              topic result: CarRepairs
              substring from 0 which is "C" to query length which is 4 = 
                      01234 + ...
              output: CarR + epairs   

          highlight(CarR) +  topic.title.substring(query.length)(epairs)         
              */}
                <Highlight value={topic.title.substring(0, query.length)} />
                {topic.title.substring(query.length)}
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
