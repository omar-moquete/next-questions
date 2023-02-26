import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MyFeed from "../../components/my-feed/MyFeed";
import RouteGuard from "../../components/route-guard/RouteGuard";
import InlineSpinner from "../../components/UI/inline-spinner/InlineSpinner";

const MyFeedPage = function () {
  return (
    // Render <MyFeed /> if user is logged in. If user is not logged in redirect to "/login"
    <RouteGuard redirectPath="/login">
      <MyFeed />
    </RouteGuard>
  );
};

export default MyFeedPage;
