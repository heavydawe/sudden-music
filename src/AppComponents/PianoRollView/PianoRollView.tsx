import PianoTiles from "./PianoRollViewComponents/PianoTiles";
import BodyCanvas from "./PianoRollViewComponents/BodyCanvas";
import './PianoRollView.css';

function PianoRollView() {

  return (
    <div key="gridContainer" className="gridContainer">
      <PianoTiles />
      <BodyCanvas />
    </div>
  );
}

export default PianoRollView;
