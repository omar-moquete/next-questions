import React, { useEffect } from "react";
import classes from "./LikesList.module.scss";
import TimeAgo from "react-timeago";
import Link from "next/link";
import { timeAgoFormatter } from "../../utils";
import { useSelector } from "react-redux";

const LikesList = function ({ data }) {
  const user = useSelector((slices) => slices.auth.user);

  // sort data by date
  data.sort((a, b) => {
    const dateA = +new Date(a.date);
    const dateB = +new Date(b.date);
    if (dateA < dateB) return 1;
    if (dateA > dateB) return -1;
    return 0;
  });
  return (
    <ul className={classes["likes-list"]}>
      {data.map((like) => {
        // Exclude the current user from the list
        if (user && user.username === like.likedBy) return "";

        return (
          <li key={like.date}>
            <Link href={`/${like.likedBy}`}>{like.likedBy}</Link>
            <TimeAgo
              date={like.date}
              formatter={timeAgoFormatter}
              minPeriod={60}
            />
          </li>
        );
      })}
    </ul>
  );
};

export default LikesList;
