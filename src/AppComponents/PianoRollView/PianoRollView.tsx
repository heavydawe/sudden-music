import PianoTiles from "./PianoRollViewComponents/PianoTiles";
import "./PianoRollView.css";
import PianoRollCanvas from "./PianoRollViewComponents/PianoRollCanvas";
import { Rootstate } from "../Interfaces";
import { useSelector } from "react-redux";
import { useEffect } from "react";

// const testNotes: MidiNote[] = [
//   {
//     datakey: -2,
//     startTime: 768,
//     length: 96,
//     note: "B6",
//   },
//   {
//     datakey: -1,
//     startTime: 384,
//     length: 48,
//     note: "E5",
//   }
// ]

function PianoRollView() {
  const selectedMidiClip = useSelector(
    (state: Rootstate) => state.selectedMidiClip
  );

  console.log("new MIDI CLIP", selectedMidiClip); 
  // TODO: piano roll needs to update correctly, when a new midi clip is selected

  // return (
  //   <div key="gridContainer" className="gridContainer">
  //     <PianoTiles />
  //     <PianoRollCanvas midiClip={selectedMidiClip === null ? {dataKey: -1, notes: [], length: 0, startTime: 0, trackKey: 0} : selectedMidiClip} />
  //   </div>
  // );

  useEffect(() => {
    document.getElementById("piano60")?.scrollIntoView({behavior: "smooth"});
  })

  return (
    <>
    {selectedMidiClip !== null && (
      <div key="gridContainer" className="gridContainer">
        <PianoTiles />
        <PianoRollCanvas midiClip={selectedMidiClip} />
      </div>
    )}
  </>
  );
}

export default PianoRollView;
