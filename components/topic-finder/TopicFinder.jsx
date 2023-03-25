import React, { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useSelector } from "react-redux";
import HashIcon from "../UI/svg/HashIcon";
import FeedIcon from "../UI/svg/FeedIcon";
import classes from "./TopicFinder.module.scss";
import TopicResults from "./TopicsResults";
import { useRouter } from "next/router";
import { getTopicsWithQuery } from "../../db";
import { TOPIC_VALIDATION_REGEX } from "../../app-config";

const TopicFinder = function ({
  onSelect,
  onNewTopic,
  onChange,
  className = "",
  placeholder,
  required = false,
  resetSearchBar,
}) {
  // Controls typed data
  const topicInputRef = useRef();
  const [topicQuery, setTopicQuery] = useState("");
  // User is considered typing if a truthy value is inserted in the input field and if an option is selected from the dropdown
  const [isTyping, setIsTyping] = useState(false);
  const [topicResults, setTopicResults] = useState([]);
  const [searchingTopic, setSearchingTopic] = useState(false);
  const [isTopicValid, setIsTopicValid] = useState(true);
  const router = useRouter();

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
    // Adds text to topicInput if passed through a url query and sets the topicQuery state.
    (async () => {
      if (router.asPath.includes("?topic=")) {
        const query = router.asPath.split("?topic=")[1];
        const topicData = (await getTopicsWithQuery(query))[0];
        topicInputRef.current.value = topicData.title;
        setTopicQuery(query);
        onSelect(topicData.uid, topicData.title);
      }
    })();
    // Controls outside click
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

  const handleFeedIconClick = () => {
    router.push("/my-feed");
  };

  const handleResults = () => {
    onChange && onChange();
    const inputValue = topicInputRef.current.value.trim();
    topicInputRef.current.value = inputValue;
    const currentQuery = inputValue;

    if (TOPIC_VALIDATION_REGEX.test(currentQuery)) setIsTopicValid(true);
    else setIsTopicValid(false);

    // if no query user is not typing
    if (!currentQuery) setIsTyping(false);
    else setIsTyping(true);

    setTopicQuery(currentQuery);
  };

  useEffect(() => {
    if (topicInputRef.current && router.query.query)
      topicInputRef.current.value = router.query.query;
  }, [topicInputRef]);

  // Will clear topic input field if a search is occurring.
  const searchParam = useSelector((slices) => slices.global.searchParam);
  useEffect(() => {
    if (searchParam) topicInputRef.current.value = "";
  }, [searchParam]);
  const user = useSelector((slices) => slices.auth.user);

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
          required={required}
        />
        {router.asPath.split("?")[0] === "/feed" && user && (
          <button
            className={classes["my-feed-button"]}
            onClick={handleFeedIconClick}
          >
            <FeedIcon />
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
          resetSearchBar={resetSearchBar}
          isTopicValid={isTopicValid}
        />
      )}
    </div>
  );
};

export default TopicFinder;
