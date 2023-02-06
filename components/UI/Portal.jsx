import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const Portal = function ({ show, children }) {
  const [mounted, setMounted] = useState(false);

  // Prevents document undefined error during SSR
  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  });
  return mounted && show
    ? createPortal(children, document.getElementById("portal"))
    : null;
};

export default Portal;
