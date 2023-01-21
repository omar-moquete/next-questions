import React, { useState } from "react";
import classes from "./TopicItem.module.scss";

const TopicItem = function (props) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [topicUid, setTopicUid] = useState(props.uid);

  const handleRemove = () => {
    console.log("Execute removal");
    // [ ] Remove topic item from db (users.topics).
    // [ ] Update view accordingly.
  };

  const showRemove = () => {
    setIsRemoving(true);
  };
  const cancelRemove = () => {
    // Makes sure state is only set if mouse left while remove overlay is on.
    if (!isRemoving) return;
    console.log("mouseLeft");
    setIsRemoving(false);
  };
  return (
    <div
      onClick={showRemove}
      onMouseLeave={cancelRemove}
      className={classes.topic}
    >
      {isRemoving && (
        <div className={classes.remove} onClick={handleRemove}>
          Remove
        </div>
      )}
      #{props.text}
    </div>
  );
};

export default TopicItem;
