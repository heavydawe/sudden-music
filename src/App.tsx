// import { connectAdvanced, useDispatch } from "react-redux";
import "./App.css";
import ArrangementView from "./AppComponents/ArrangementView/ArrangementView";
// import { appAuth } from "./AppComponents/firebase";
import Footer from "./AppComponents/Footer/Footer";
import Header from "./AppComponents/Header/Header";
import NavigationBar from "./AppComponents/NavigationBar/NavigationBar";
import PianoRollView from "./AppComponents/PianoRollView/PianoRollView";
// import * as Tone from "tone";

function App() {
  // const dispatch = useDispatch();

  return (
    <div className="App" id="App">
      <Header />
      <NavigationBar />
      <div className="mainPart">
        <ArrangementView />
        <PianoRollView />
      </div>
      <Footer />
    </div>
  );
}

export default App;
