import { observer } from "mobx-react-lite";
import React from "react";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { MainPage } from "./pages/MainPage";
import { UserPage } from "./pages/UserPage";

const App = observer(() => {
  return (
    <>
      <div className="wrapper">
        <Header />
        <div className="main">
          <AuthProvider />
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/user/:id" element={<UserPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </>
  );
});

export default App;
