import React from "react";
import { TailSpin } from "react-loader-spinner";
import classes from "./Loading.module.scss";

const Loading = function () {
  return (
    <div className={classes.loading}>
      <TailSpin
        height="50"
        width="50"
        color="#005c97"
        ariaLabel="tail-spin-loading"
        radius="1"
        visible={true}
      />
    </div>
  );
};

export default Loading;
