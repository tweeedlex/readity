import React from "react";
import { Modal } from "./Modal";
import scoreStore from "../store/scoreStore";
import { observer } from "mobx-react-lite";
import styles from "./css/Questions.module.css";
import axios from "axios";
import authStore from "../store/authStore";

export const Questions = observer(
  ({ questions, setIsResultVisible, isVisible, setIsVisible, wpm, textId }) => {
    
    const saveResults = async () => {
      const comprehension = Math.round(
        (scoreStore.score / questions.length) * 100
      );
      await axios.post(process.env.REACT_APP_API_URL + "/stats", {
        wpm,
        comprehension,
        textId,
        email: authStore.user.email
      });
    };

    const checkAnswers = async () => {
      questions.forEach((question) => {
        const answer = document.querySelector(
          `input[name="${
            question.question.slice(0, 5) + questions.indexOf(question)
          }"]:checked`
        );

        if (
          answer &&
          answer.value ===
            question.answers.find((a) => a.isRight === true).answer
        ) {
          scoreStore.setScore(scoreStore.score + 1);
        }
      });
      setIsVisible(false);
      setIsResultVisible(true);

      saveResults();
    };

    return (
      <Modal
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        bgHidden={true}
        blockHide={true}
      >
        <div className={styles.modal}>
          {questions &&
            questions.map((question, index) => (
              <div key={question.question} className={styles.question}>
                <p className={styles.questionText}>
                  {index + 1}. {question.question}
                </p>
                <div>
                  {question.answers.map((answer) => (
                    <div key={answer.answer} className={styles.answer}>
                      <input
                        type="radio"
                        id={
                          answer.answer.slice(0, 5) +
                          question.answers.indexOf(answer)
                        }
                        name={
                          question.question.slice(0, 5) +
                          questions.indexOf(question)
                        }
                        value={answer.answer}
                      />
                      <label htmlFor={answer.answer.slice(0, 5)}>
                        {answer.answer}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          <button
            className={"action " + styles.finish}
            onClick={() => checkAnswers()}
          >
            Finish
          </button>
        </div>
      </Modal>
    );
  }
);
