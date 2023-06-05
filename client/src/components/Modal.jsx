import React, { useEffect } from "react";
import styles from "./css/Modal.module.css";

export const Modal = ({ children, isVisible, setIsVisible, zIndex, bgHidden, blockHide }) => {
  let body = document.querySelector("body");

  useEffect(() => {
    if (isVisible) {
      body.classList = "lock";
    } else {
      body.classList = "";
    }
  }, [isVisible]);

  return (
    <div
      style={{
        zIndex: zIndex ? zIndex : "unset",
        display: isVisible ? "flex" : "none",
      }}
      onClick={() => blockHide ? null : setIsVisible(false)}
      className={styles.modal + " " + (bgHidden ? styles.bgHidden : "")}
    >
      <div
        style={{ zIndex: zIndex ? zIndex + 1 : "unset" }}
        onClick={(e) => e.stopPropagation()}
        className={styles.form}
      >
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};
