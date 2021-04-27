import { useDispatch } from "react-redux";
import "./App.css";
import { exportProject } from "./AppComponents/Actions";
import ArrangementView from "./AppComponents/ArrangementView/ArrangementView";
import Footer from "./AppComponents/Footer/Footer";
import Header from "./AppComponents/Header/Header";
import NavigationBar from "./AppComponents/NavigationBar/NavigationBar";
import PianoRollView from "./AppComponents/PianoRollView/PianoRollView";

function App() {

  const dispatch = useDispatch();

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
      <button onClick={() => {dispatch(exportProject())}}>TEST</button>
    </div>
  );
}

export default App;
