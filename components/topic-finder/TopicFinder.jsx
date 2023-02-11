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
import { getTopicsWithQuery } from "../../db";

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
  const [searchingTopic, setSearchingTopic] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  // Used to show/hide my feed button depending on the selected feed.
  const selectedTopicUid = useSelector(
    (state) => state.global.selectedTopicUid
  );

  const unmount = () => {
    setIsTyping(false);
  };

  const [lastQueryWithResults, setLastQueryWithResults] = useState();
  const [firstTimeExecution, setFirstTimeExecution] = useState(true);
  useEffect(() => {
    if (firstTimeExecution) {
      setFirstTimeExecution(false);
      return;
    }
    (async () => {
      // If there are no results, the query is not empty, the query is not equal to the last query with results, but the query includes part of the last questions with results, then search.
      // This assessment will prevent unnecessary database reads.
      if (
        topicResults.length === 0 &&
        topicQuery !== "" &&
        topicQuery !== lastQueryWithResults &&
        topicQuery.startsWith(lastQueryWithResults)
      ) {
        return;
      }
      setSearchingTopic(true);
      const results = await getTopicsWithQuery(topicQuery);
      if (results.length > 0) {
        setLastQueryWithResults(topicQuery);
      }
      setTopicResults(results);
      setSearchingTopic(false);
    })();
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
    if (!currentQuery) setIsTyping(false);
    else setIsTyping(true);
    setTopicQuery(currentQuery);
  };

  useEffect(() => {
    if (topicInputRef.current && router.query.query)
      topicInputRef.current.value = router.query.query;
  }, [topicInputRef]);

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
        {selectedTopicUid && router.asPath.split("?")[0] === "/feed" && (
          <button
            className={classes["my-feed-button"]}
            onClick={resetCurrentTopic}
          >
            <FeedIcon />
            My feed
          </button>
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
          searchingTopic={searchingTopic}
        />
      )}
    </div>
  );
};

export default TopicFinder;
