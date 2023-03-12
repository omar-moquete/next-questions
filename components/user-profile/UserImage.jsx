import { useRouter } from "next/router";
import React from "react";
import { useSelector } from "react-redux";
import AvatarIllustration from "../UI/svg/AvatarIllustration";
import classes from "./UserImage.module.scss";

const UserImage = function ({ imageUrl }) {
  /* If user and viewing user's profile page, the image will be tied to a state in case it changes. */
  const user = useSelector((slices) => slices.auth.user);
  const router = useRouter();

  const visitedUser = router.asPath.split("/")[1];

  // If user visiting self and there is an image
  if (user?.username === visitedUser && user.imageUrl)
    return <img src={user.imageUrl} alt="User picture" />;

  // If no user and imageUrl
  if (!user && imageUrl) return <img src={imageUrl} alt="User picture" />;

  // If user visiting another user with an image
  if (user?.username !== visitedUser && imageUrl)
    return <img src={imageUrl} alt="User picture" />;

  return <AvatarIllustration className={classes.avatar} />;
};

export default UserImage;
