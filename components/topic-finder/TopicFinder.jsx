import React, { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTopicsWithTopicText } from "../../_TEST_DATA";
import PrimaryButton from "../UI/buttons/PrimaryButton";
import HashIcon from "../UI/svg/HashIcon";
import FeedIcon from "../UI/svg/FeedIcon";
import classes from "./TopicFinder.module.scss";
import TopicResults from "./TopicsResults";
import { globalActions } from "../../redux-store/globalSlice";
import { useRouter } from "next/router";

const TopicFinder = function ({
  onSelect,
  onNewTopic,
  onChange,
  className = "",
  placeholder,
  value,
  required = false,
}) {
  // Controls typed data
  const topicInputRef = useRef();
  const [topicQuery, setTopicQuery] = useState("");
  // User is considered typing if a truthy value is inserted in the input field and if an option is selected from the dropdown
  const [isTyping, setIsTyping] = useState(false);
  const [topicResults, setTopicResults] = useState([]);
  const dispatch = useDispatch();
  // Used to show/hide my feed button depending on the selected feed.
  const selectedTopicUid = useSelector(
    (state) => state.global.selectedTopicUid
  );

  const unmount = () => {
    setIsTyping(false);
  };

  useEffect(() => {
    // if topic query is set search topics and set results
    if (!topicQuery) return;
    const results = getTopicsWithTopicText(topicQuery);
    setTopicResults(results);
  }, [topicQuery]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!topicInputRef.current.contains(e.target)) unmount();
    };

    const handleEscKeyPress = (e) => {
      if (e.key === "Escape") unmount();
    };

    document.addEventListener("click", handleOutsideClick);

    document.addEventListener("keyup", handleEscKeyPress);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("keyup", handleOutsideClick);
    };
  }, []);

  const onFocus = () => {
    topicInputRef.current.select();
    if (topicInputRef.current.value) setIsTyping(true);
  };

  // set currentTopic to null (null is the default of my feed)
  const resetCurrentTopic = () => {
    // Clear topic input field
    topicInputRef.current.value = "";
    // Reset topic to null (null is default for My Feed)
    dispatch(globalActions.setSelectedTopic(null));
  };

  const handleResults = () => {
    onChange && onChange();
    const currentQuery = topicInputRef.current.value;

    // if no query user is not typing
    if (!currentQuery) {
      setIsTyping(false);
      setTopicQuery("");
    } else {
      setTopicQuery(currentQuery);
      setIsTyping(true);
    }
  };

  const router = useRouter();
  useEffect(() => {
    if (topicInputRef.current && router.query.query)
      topicInputRef.current.value = router.query.query;
  }, [topicInputRef]);

  // if user leaves focus and did not select, clear input.
  // if user presses esc and did not select, clear.

  return (
    <div className={`${classes.topics} ${className}`}>
      <div className={classes["input-wrapper"]}>
        <HashIcon />
        <input
          ref={topicInputRef}
          onChange={handleResults}
          onFocus={onFocus}
          type="text"
          placeholder={placeholder || ""}
          value={value}
          required={required}
        />
        {selectedTopicUid && (
          <PrimaryButton
            className={classes["my-feed-button"]}
            onClick={resetCurrentTopic}
          >
            <FeedIcon />
            My feed
          </PrimaryButton>
        )}
      </div>
      {isTyping && (
        <TopicResults
          topics={topicResults}
          query={topicQuery}
          setQuery={setTopicQuery}
          unmount={unmount}
          onSelect={onSelect}
          onNewTopic={onNewTopic}
          inputRef={topicInputRef}
        />
      )}
    </div>
  );
};

export default TopicFinder;
