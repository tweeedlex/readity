import axios from "axios";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import authStore from "../store/authStore";
import styles from "./css/UserPage.module.css";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { Colors } from "chart.js";

export const UserPage = observer(() => {
  const [stats, setStats] = useState({});
  const [registrationDate, setRegistrationDate] = useState("");

  useEffect(() => {
    if (authStore.user) {
      getStats();
    }
  }, [authStore.user?.uid]);

  const getStats = async () => {
    const response = await axios.get(
      process.env.REACT_APP_API_URL + "/stats?uid=" + authStore.user.uid
    );
    setStats(response.data.result);

    const date = new Date(+authStore.user?.metadata.createdAt);
    setRegistrationDate(date.toLocaleDateString());
  };

  return (
    <div>
      <div className="container container-1000">
        <div className={styles.head}>
          <div className={styles.profile}>
            <img
              className={styles.photo}
              src={authStore.user?.photoURL}
              alt="photo"
            />
            <div>
              <p className={styles.name}>{authStore.user?.displayName}</p>
              <p>Registered: {registrationDate}</p>
            </div>
          </div>
          <div className={styles.mainStats}>
            <p>Tests completed: {stats.testsCompleted || "-"}</p>
            <p>
              Best 100% result: {stats.bestWPMWithMaxComprehension || "-"} WPM
            </p>
          </div>
        </div>
        <div className={styles.blocks}>
          <div className={styles.block}>
            <p className={styles.cardHeading}>Average WPM</p>
            <p className={styles.score}>{stats.averageWPM || "-"}</p>
          </div>
          <div className={styles.block}>
            <p className={styles.cardHeading}>Average comprehention</p>
            <p className={styles.score}>
              {stats.averageComprehension
                ? stats.averageComprehension + "%"
                : "-"}
            </p>
          </div>
          <div className={styles.block}>
            <p className={styles.cardHeading}>Favourite theme</p>
            <p className={styles.score}>{stats.favouriteTheme || "-"}</p>
          </div>
        </div>
        <Line
          style={{marginTop: "40px"}}
          data={{
            labels: [...Array(stats.testsCompleted).keys()].map((i) => i + 1),
            datasets: [
              {
                id: 1,
                label: "WPM",
                data: stats?.stats?.map((stat) => stat.wpm),
                backgroundColor: "rgba(255, 255, 255, 1)",
                borderColor: "rgba(255, 255, 255, 1)",
                borderWidth: 2,
                pointRadius: 4,
                yAxisID: "y1",
              },
              {
                id: 2,
                label: "Comprehension",
                data: stats?.stats?.map((stat) => stat.comprehension),
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                borderColor: "rgba(255, 255, 255, 0.5)",
                borderWidth: 2,
                pointRadius: 4,
                yAxisID: "y2",
              },
            ],
          }}
          options={{
            plugins: {
              colors: {
                enabled: true,
                fontColor: "white",
              },
              legend: {
                labels: {
                  color: "white",
                  font: {
                    size: 24,
                    color: "white",
                    family: "Montserrat",
                  },
                },
              },
            },
            scales: {
              x: {
                grid: {
                  color: "#999",
                },
                ticks: {
                  color: "white",
                  font: {
                    size: 16,
                    family: "Montserrat",
                  },
                },
              },
              y1: {
                position: "left",
                grid: {
                  color: "rgba(0, 0, 0, 0)",
                  borderColor: "white",
                  borderWidth: 1,
                },
                ticks: {
                  color: "white",
                  font: {
                    size: 16,
                    family: "Montserrat",
                  },
                },
              },
              y2: {
                position: "right",
                grid: {
                  color: "rgba(0, 0, 0, 0)",
                  borderColor: "white",
                  borderWidth: 1,
                },
                ticks: {
                  color: "white",
                  font: {
                    size: 16,
                    family: "Montserrat",
                  },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
});
