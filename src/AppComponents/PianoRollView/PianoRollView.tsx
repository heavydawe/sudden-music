import PianoTiles from "./PianoRollViewComponents/PianoTiles";
import './PianoRollView.css';
import PianoRollCanvas from "./PianoRollViewComponents/PianoRollCanvas";

function PianoRollView() {

  return (
    <div key="gridContainer" className="gridContainer">
      <PianoTiles />
      <PianoRollCanvas />
    </div>
  );
}

export default PianoRollView;
