import PianoTiles from "./PianoRollViewComponents/PianoTiles";
import './PianoRollView.css';
import PianoRollCanvas from "./PianoRollViewComponents/PianoRollCanvas";
import { MidiNote } from "../Interfaces";

const testNotes: MidiNote[] = [
  {
    datakey: -2,
    startTime: 768,
    length: 96,
    note: "B6",
  },
  {
    datakey: -1,
    startTime: 384,
    length: 48,
    note: "E5",
  }
]

function PianoRollView() {

  return (
    <div key="gridContainer" className="gridContainer">
      <PianoTiles />
      <PianoRollCanvas notes={testNotes} />
    </div>
  );
}

export default PianoRollView;
