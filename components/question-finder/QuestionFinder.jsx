import { useRouter } from "next/router";
import React, { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { globalActions } from "../../redux-store/globalSlice";
import SearchIcon from "../UI/svg/SearchIcon";
import SendIcon from "../UI/svg/SendIcon";
import classes from "./QuestionFinder.module.scss";

const QuestionFinder = function ({ searchBarValueState }) {
  const inputRef = useRef();
  // This state comes from <FeedControlBar/>. It is used to clear the input when a topic is selected.
  const [inputValue, setInputValue] = searchBarValueState;
  const router = useRouter();
  const dispatch = useDispatch();

  const evalRedirect = () => {
    if (router.asPath.split("?")[0] !== "/feed")
      router.push(
        `/feed?search=${inputValue.split(" ").join(encodeURIComponent("&&"))}`
      );
  };

  const changeHandler = () => {
    const input = inputRef.current.value;
    setInputValue(input);
  };

  const findOnKeyUpHandler = (e) => {
    if (e.key === "Escape") {
      setInputValue("");
    }

    if (e.key === "Enter") {
      evalRedirect(); // If path === "/" redirects to "/feed"
      dispatch(globalActions.setSearchParam(inputValue)); // will be handled by useEffect in feed.
    }
  };

  const findHandler = () => {
    evalRedirect(); // If path === "/" redirects to "/feed"
    dispatch(globalActions.setSearchParam(inputValue)); // will be handled by useEffect in feed.
  };

  useEffect(() => {
    // sets search parameter. /feed will perform a search if there is a search parameter in global state.
    const path = router.asPath;
    if (!path.includes("?search=")) return;
    const searchParam = router.asPath.split("?search=")[1];
    const decodedSearchParam = decodeURIComponent(searchParam)
      .split("&&")
      .join(" ");
    setInputValue(decodedSearchParam);
    dispatch(globalActions.setSearchParam(decodedSearchParam));

    return () => {
      dispatch(globalActions.resetSearchParam());
    };
  }, [router.asPath]);

  return (
    <div className={classes["input-wrapper"]}>
      <SearchIcon />
      <input
        type="text"
        placeholder="Search..."
        onChange={changeHandler}
        onKeyUp={findOnKeyUpHandler}
        value={inputValue}
        ref={inputRef}
      />
      {inputValue && (
        <button className={classes.find} onClick={findHandler}>
          <SendIcon />
        </button>
      )}
    </div>
  );
};

export default QuestionFinder;
