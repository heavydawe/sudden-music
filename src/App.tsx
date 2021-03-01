import React from "react";
import "./App.css";
import Footer from "./AppComponents/Footer/Footer";
import Header from "./AppComponents/Header/Header";
import NavigationBar from "./AppComponents/NavigationBar/NavigationBar";
import PianoRollView from "./AppComponents/PianoRollView/PianoRollView";

function App() {
  return (
    <>
      <Header />
      <NavigationBar />
      <PianoRollView />
      <Footer />
    </>
  );
}

export default App;
