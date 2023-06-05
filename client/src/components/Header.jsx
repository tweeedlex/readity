import React, { useState } from "react";
import styles from "./css/Header.module.css";
import profile from "../images/profile.png";
import authStore from "../store/authStore";
import { signInWithPopup, signOut } from "firebase/auth";
import { googleAuthProvider } from "../firebase";
import logoutImage from "../images/logout.png";
import axios from "axios";
import { Link } from "react-router-dom";

export const Header = () => {
  const [isPopUpOpened, setIsPopUpOpened] = useState(false);

  let body = document.querySelector("body");

  const togglePopup = () => {
    setIsPopUpOpened(!isPopUpOpened);
    isPopUpOpened
      ? body.classList.remove("locked")
      : body.classList.add("locked");
  };

  const login = async () => {
    signInWithPopup(authStore.auth, googleAuthProvider)
      .then((credentials) => authStore.setUser(credentials.user))
      .then(async () => {
        await axios.post(process.env.REACT_APP_API_URL + "/user", {
          email: authStore.user?.email,
          uid: authStore.user?.uid
        });
      })
      .catch((error) => console.log(error));
  };

  const logout = () => {
    signOut(authStore.auth).then(() => authStore.setUser(null));
  };

  return (
    <header className={styles.header}>
      {console.log(authStore.user)}
      <div className={"container container-1000 " + styles.container}>
        <nav className={styles.nav}>
        </nav>
        <div className={styles.logo}>
          <Link to="/">Readity</Link>
        </div>
        <button onClick={togglePopup} className={styles.profile}>
          <img src={profile} alt="" />
        </button>
        {isPopUpOpened && (
          <div className={styles.popUp} onClick={togglePopup}>
            <div className={"container container-1000 " + styles.popUpContainer}>
              {authStore.user ? (
                <div className={styles.popUpContent}>
                  <p className={styles.name}>{authStore.user?.displayName}</p>
                  <p className={styles.email}>{authStore.user?.email}</p>
                  <Link to={`/user/${authStore.user?.uid}`}>My statistics</Link>
                  <button className={styles.logout} onClick={() => logout()}>
                    Log out
                    <img src={logoutImage} />
                  </button>
                </div>
              ) : (
                <div className={styles.popUpContentUnlogined}>
                  <a className={styles.login} onClick={() => login()}>
                    Login with Google
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
