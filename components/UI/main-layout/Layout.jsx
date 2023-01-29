import React, { useEffect } from "react";
import NavBar from "./nav-bar/NavBar";
import Footer from "./footer/Footer";
import useAuth from "../../../hooks/useAuth";
import FloatingActionButton from "./floating-action-button/FloatingActionButton";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const Layout = function (props) {
  useAuth();
  const user = useSelector((state) => state.auth.user);
  const router = useRouter();
  // [ ]TODO: Add "back to top" button (maybe an arrow up bottom-centered)
  return (
    <>
      <NavBar />
      {props.children}
      {router.asPath.split("?")[0] !== "/new-question" && user && (
        <FloatingActionButton />
      )}
      <Footer />
    </>
  );
};

export default Layout;
