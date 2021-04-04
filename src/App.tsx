import React from "react";
import { useSelector, useDispatch } from "react-redux";
import "./App.css";
import ArrangementView from "./AppComponents/ArrangementView/ArrangementView";
import Footer from "./AppComponents/Footer/Footer";
import Header from "./AppComponents/Header/Header";
import NavigationBar from "./AppComponents/NavigationBar/NavigationBar";
import PianoRollView from "./AppComponents/PianoRollView/PianoRollView";
import { selectNewView } from "./AppComponents/Actions";

interface Rootstate {
  selectView: string;
}

function App() {

  const currentView = useSelector((state: Rootstate) => state.selectView);
  const dispatch = useDispatch();

  console.log("Current page: ", currentView);

  return (
    <div className="App">
      <Header />
      <NavigationBar />
      {currentView === "arr" ?  <ArrangementView /> : <PianoRollView />}
      <Footer />
      <button onClick={() => {dispatch(selectNewView("arr"))}}></button>
    </div>
  );
}

export default App;
