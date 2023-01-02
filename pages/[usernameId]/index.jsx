import React from "react";
import UserProfile from "../../components/user-profile/UserProfile";

const ProfilePage = function () {
  const DUMMY_DATA = {
    email: "n@n.com",
    name: "George",
    lastname: "Wick",
    profilePictureUrl:
      "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50",
  };
  return <UserProfile userData={DUMMY_DATA} />;
};

export default ProfilePage;
