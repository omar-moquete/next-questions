import React from "react";
import UserProfile from "../../components/user-profile/UserProfile";
import { useRouter } from "next/router";
import Loading from "../../components/loading/Loading";
import { getPublicUserData } from "../../db";

const ProfilePage = function ({ publicUserData }) {
  const router = useRouter();
  if (router.isFallback) return <Loading />;
  return <UserProfile publicUserData={publicUserData} />;
};

export default ProfilePage;

export const getStaticProps = async function ({ params }) {
  const publicUserData = await getPublicUserData(params.usernameId);

  // === null because getPublicUserData() returns null if no user was found with the username Id passed.

  if (publicUserData === null) {
    return { notFound: true };
  }
  return {
    props: {
      publicUserData,
    },
  };
};

export const getStaticPaths = async function () {
  // Rendered server-side on demand
  return {
    paths: [],
    fallback: true,
  };
};
