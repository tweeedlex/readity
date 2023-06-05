import { React, useState } from "react";
import axios from "axios";
import { Questions } from "../components/Questions";
import { WPM } from "../components/WPM";
import { Modal } from "../components/Modal";
import scoreStore from "../store/scoreStore";

import styles from "./css/MainPage.module.css";
import { Text } from "../components/Text";

export const MainPage = () => {
  const [text, setText] = useState("");
  const [questions, setQuestions] = useState([]);
  const [theme, setTheme] = useState("");
  const [size, setSize] = useState("short");
  const [font, setFont] = useState("Montserrat");
  const [language, setLanguage] = useState("English");

  const [score, setScore] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [wordsNumber, setWordsNumber] = useState(0);

  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [wpm, setWpm] = useState(0);

  const [isQuestionsVisible, setIsQuestionsVisible] = useState(false);
  const [isResultVisible, setIsResultVisible] = useState(false);
  const [isTextVisible, setIsTextVisible] = useState(true);

  const [textId, setTextId] = useState(0);

  const sendRequest = async () => {
    if (isLoading) {
      return alert("Please wait until the previous request is completed");
    }

    resetAll();
    setIsLoading(true);
    const response = await axios.post(process.env.REACT_APP_API_URL + "/text", {
      size,
      theme,
      language,
    });
    setIsLoading(false);

    console.log(response);
    const text = response.data.text;
    setTextId(response.data.id);
    setWordsNumber(countWords(text));

    setText(text);
    setIsTextVisible(true);
    startWPM();
    setQuestions(response.data.questions);
  };

  const startWPM = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const pause = () => {
    setIsPaused(true);
    setIsQuestionsVisible(true);
    setIsTextVisible(false);
  };

  const resetWPM = () => {
    setIsActive(false);
  };

  const countWords = (text) => {
    const words = text.split(" ");
    return words.length;
  };

  const resetAll = () => {
    setText("");
    setQuestions([]);
    resetWPM();
    scoreStore.setScore(0);
  };

  const getRandomTheme = async () => {
    const response = await axios.get(
      process.env.REACT_APP_API_URL + "/random-theme"
    );
    setTheme(response.data.theme);
  };

  return (
    <div className={"container " + styles.container}>
      <div className={styles.theme}>
        <input
          className={styles.input}
          placeholder="Enter your theme..."
          type="text"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        />
        <button className={styles.button} onClick={() => getRandomTheme()}>
          Random theme
        </button>
      </div>
      <div className={styles.sentences}>
        <p>Language:</p>
        <div className={styles.selectWrapper}>
          <select
            className={styles.select}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="English">English</option>
            <option value="Ukrainian">Ukrainian</option>
            <option value="French">French</option>
            <option value="Arabic">Arabic</option>
          </select>
        </div>
      </div>
      <div className={styles.sentences}>
        <p>Size:</p>
        <div className={styles.selectWrapper}>
          <select
            className={styles.select}
            onChange={(e) => setSize(e.target.value)}
          >
            <option value="short">Short</option>
            <option value="medium size">Medium</option>
            <option value="big">Big</option>
            <option value="large">Large</option>
            <option value="extremely large">Extremely large</option>
          </select>
        </div>
      </div>
      <div className={styles.font}>
        <p>Font: </p>
        <div className={styles.selectWrapper}>
          <select
            className={styles.select}
            onChange={(e) => setFont(e.target.value)}
          >
            <option style={{ fontFamily: "Montserrat" }} value="Montserrat">
              Montserrat
            </option>
            <option style={{ fontFamily: "Arial" }} value="Arial">
              Arial
            </option>
            <option
              style={{ fontFamily: "Times New Roman" }}
              value="Times New Roman"
            >
              Times New Roman
            </option>
            <option style={{ fontFamily: "Courier New" }} value="Courier New">
              Courier New
            </option>
          </select>
        </div>
      </div>
      <button className="action" onClick={() => sendRequest()}>
        Generate text
      </button>
      {isLoading ? (
        <div>Loading...</div>
      ) : text ? (
        <Text
          text={text}
          pause={pause}
          wpm={wpm}
          isTextVisible={isTextVisible}
          setIsTextVisible={setIsTextVisible}
          font={font}
        />
      ) : null}
      <WPM
        isActive={isActive}
        isPaused={isPaused}
        wordsNumber={wordsNumber}
        wpm={wpm}
        setWpm={setWpm}
      />
      <Questions
        isVisible={isQuestionsVisible}
        setIsVisible={setIsQuestionsVisible}
        setIsResultVisible={setIsResultVisible}
        questions={questions}
        score={score}
        setScore={setScore}
        resetAll={resetAll}
        wpm={wpm}
        textId={textId}
      />
      <Modal isVisible={isResultVisible} setIsVisible={setIsResultVisible}>
        <p>Correct answers: {scoreStore.score}.</p>
        <p>Words per minute: {wpm}</p>
      </Modal>
    </div>
  );
};
