import "./App.css";
import ArrangementView from "./AppComponents/ArrangementView/ArrangementView";
import Footer from "./AppComponents/Footer/Footer";
import Header from "./AppComponents/Header/Header";
import NavigationBar from "./AppComponents/NavigationBar/NavigationBar";
import PianoRollView from "./AppComponents/PianoRollView/PianoRollView";

function App() {
  return (
    <div
      className="App"
    >
      <Header />
      <NavigationBar />
      <div>
        <ArrangementView />
        <PianoRollView />
      </div>
      <Footer />
      <button onClick={() => {}}>TEST</button>
    </div>
  );
}

export default App;
