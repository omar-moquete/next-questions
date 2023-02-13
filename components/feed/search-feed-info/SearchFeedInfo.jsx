import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import classes from "./SearchFeedInfo.module.scss";

const SearchFeedInfo = function ({ results }) {
  const searchParam = useSelector((slices) => slices.global.searchParam);
  return (
    <>
      {!(results.length === 0) && (
        <div className={classes.container}>
          <div className={classes.title}>
            <h3>Search</h3>
          </div>
          <p>
            Showing results for "<i>{searchParam}</i>".
          </p>
        </div>
      )}

      {results.length === 0 && (
        <div className={classes.container}>
          <div className={classes.title}>
            <h3>No results</h3>
          </div>
          <p>
            No questions found for "<i>{searchParam}</i>".{" "}
            <Link href={"/new-question"}>Ask a new question?</Link>
          </p>
        </div>
      )}
    </>
  );
};

export default SearchFeedInfo;
