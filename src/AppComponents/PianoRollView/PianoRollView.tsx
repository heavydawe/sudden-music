import PianoTiles from "./PianoRollViewComponents/PianoTiles";
import "./PianoRollView.css";
import PianoRollCanvas from "./PianoRollViewComponents/PianoRollCanvas";
import { Rootstate } from "../Interfaces";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { deselectMidiClip } from "../Actions";

function PianoRollView() {
  const dispatch = useDispatch();

  const [
    curPianoRollGridPadding,
    setCurPianoRollGridPadding,
  ] = useState<number>(16);

  const selectedMidiClipInfo = useSelector(
    (state: Rootstate) => state.selectedMidiClip
  );

  const curTrackInfos = useSelector((state: Rootstate) => state.curTracks);

  console.log("new MIDI CLIP", selectedMidiClipInfo, curTrackInfos);

  let selectedMidiClip;
  if (selectedMidiClipInfo !== null) {
    selectedMidiClip = curTrackInfos.tracks[
      selectedMidiClipInfo.trackKey
    ].midiClips.find(
      (midiClip) => midiClip.dataKey === selectedMidiClipInfo.midiClipDataKey
    );
  }

  useEffect(() => {
    document.getElementById("piano60")?.scrollIntoView({ behavior: "smooth" });
  }, [selectedMidiClipInfo]);

  // Currently selected MidiClip changed track, so hide pianoRoll
  if (selectedMidiClip === undefined) {
    dispatch(deselectMidiClip());
    return <></>;
  } else {
    return (
      <>
        {selectedMidiClipInfo !== null && selectedMidiClip !== undefined && (
          <div className="pianoRollView">
            <span>Rácsok sűrűsége:</span>
            <select
              defaultValue="16"
              onChange={(e) => setCurPianoRollGridPadding(+e.target.value)}
            >
              <option value="4">4</option>
              <option value="8">8</option>
              <option value="16">16</option>
              <option value="32">32</option>
              <option value="64">64</option>
            </select>
            <div key="gridContainer" className="gridContainer">
              <PianoTiles />
              <PianoRollCanvas
                midiClip={selectedMidiClip}
                gridPadding={curPianoRollGridPadding}
              />
            </div>
          </div>
        )}
      </>
    );
  }
}

export default PianoRollView;
