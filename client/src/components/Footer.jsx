import React from "react";
import mailImage from "../images/mail.png";
import styles from "./css/Footer.module.css"

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={"container container-1000 " + styles.container}>
        <p>© Readity 2023</p>
        <p>
          <img src={mailImage} />
          readity@gmail.com
        </p>
      </div>
    </footer>
  );
};
