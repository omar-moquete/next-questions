import React, { useEffect, useState } from "react";

const SelectedImageNameDisplayer = function ({ fileName, onUnmount }) {
  useEffect(() => {
    return onUnmount;
  }, []);
  return <div>{fileName || "No image chosen"}</div>;
};

export default SelectedImageNameDisplayer;
