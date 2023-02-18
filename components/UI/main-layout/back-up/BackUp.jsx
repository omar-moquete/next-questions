import { throttle } from "lodash";
import React, { useEffect, useState } from "react";
import Chevron from "../../svg/chevron";
import classes from "./BackUp.module.scss";

const BackUp = function () {
  const [show, setShow] = useState(false);
  const handler = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight) setShow(true);
      else setShow(false);
    };

    const throttledHandler = throttle(handleScroll, 200, {
      leading: false,
      trailing: true,
    });

    window.addEventListener("scroll", throttledHandler);
    return () => {
      window.removeEventListener("scroll", throttledHandler);
    };
  }, []);

  if (!show) return null;

  return (
    <div className={classes.up} onClick={handler}>
      <Chevron />
    </div>
  );
};

export default BackUp;
