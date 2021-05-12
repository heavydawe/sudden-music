// import { connectAdvanced, useDispatch } from "react-redux";
import "./App.css";
import ArrangementView from "./AppComponents/ArrangementView/ArrangementView";
import { appAuth } from "./AppComponents/firebase";
import Footer from "./AppComponents/Footer/Footer";
import Header from "./AppComponents/Header/Header";
import NavigationBar from "./AppComponents/NavigationBar/NavigationBar";
import PianoRollView from "./AppComponents/PianoRollView/PianoRollView";
import * as Tone from "tone";

function App() {
  // const dispatch = useDispatch();

  return (
    <div className="App" id="App">
      <Header />
      <NavigationBar />
      <div>
        <ArrangementView />
        <PianoRollView />
      </div>
      <Footer />
      <button onClick={() => console.log(appAuth.currentUser)}>
        CUR USER
      </button>
      <button onClick={() => console.log(Tone.Transport.progress)}>
        Transport progress
      </button>
    </div>
  );
}

export default App;
