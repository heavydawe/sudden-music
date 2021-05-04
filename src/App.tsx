// import { connectAdvanced, useDispatch } from "react-redux";
import "./App.css";
import ArrangementView from "./AppComponents/ArrangementView/ArrangementView";
import { appAuth, appStore } from "./AppComponents/firebase";
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
      <button
        onClick={() => {
          appStore
            .collection("users")
            .doc(appAuth.currentUser!.uid)
            .get()
            .then((doc) => {
              console.log(doc.data()!.backGroundColor);
            });
        }}
      >
        FireStore
      </button>
      <button onClick={() => console.log(appAuth.currentUser)}>CUR USER</button>
      <button onClick={() => console.log(Tone.Transport.state)}>Transport state</button>
      <button onClick={() => document.getElementById("header")!.style.setProperty("background-color", "red")}>CSS change</button>
    </div>
  );
}

export default App;
