import React from "react";
import PageNotFoundIllustration from "../components/UI/svg/NotFoundIllustration";
import SecondaryButton from "../components/UI/buttons/SecondaryButton";
import classes from "./404.module.scss";
import { useRouter } from "next/router";

const NotFound = function () {
  const router = useRouter();
  return (
    <div className={classes.main}>
      <PageNotFoundIllustration />
      <div>
        <h2>404</h2>
        <p>Sorry, the page you're looking for does not exist.</p>
        <SecondaryButton
          className={classes.btn}
          onClick={() => {
            router.replace("/");
          }}
        >
          Go to homepage
        </SecondaryButton>
      </div>
    </div>
  );
};

export default NotFound;
