import React, { useState } from "react";
import { Modal } from "./Modal";
import styles from "./css/Text.module.css";

export const Text = ({ text, pause, wpm, isTextVisible, setIsTextVisible, font }) => {
  return (
    <Modal
      isVisible={isTextVisible}
      setIsVisible={setIsTextVisible}
      blockHide={true}
    >
      <div className={styles.modal}>
        <div className={styles.text} style={{fontFamily: font}} onClick={() => pause()}>
          {text}
        </div>
        <div className={styles.footer}>
          <p>WPM: {wpm}</p>
          <p>Tap on text to stop reading...</p>
        </div>
      </div>
    </Modal>
  );
};
