import React from "react";
import classes from "./UserProfile.module.scss";
import PrimaryForm from "../UI/forms/PrimaryForm";

const UserProfile = function (props) {
  console.log(props.userData);
  return (
    <PrimaryForm>
      <div className={classes.picture}>
        <img src={props.userData.profilePictureUrl} alt="User picture" />
      </div>
    </PrimaryForm>
  );
};

export default UserProfile;
