import Track from "./ArrangementViewComponents/Track";
import "./ArrangementView.css";
import ArrangementCanvas from "./ArrangementViewComponents/ArrangementCanvas";
import { Rootstate } from "../Interfaces";
import { useSelector } from "react-redux";
import addButton from "../Icons/addButton.png";
import {  useState } from "react";
import NewTrackModal from "./ArrangementViewComponents/NewTrackModal";
// import { useState } from "react";

function ArrangementView() {
  const curTrackInfos = useSelector((state: Rootstate) => state.curTracks);
  const [showModal, setShowModal] = useState<boolean>(false);

  // function getNotesForMidiClip(trackKey: number, dataKey: number) {

  //   const midiClipIndex = curTrackInfos.tracks[trackKey].midiClips
  //     .findIndex((midiclip) => midiclip.dataKey === dataKey);

  //   return curTrackInfos.tracks[trackKey].midiClips[midiClipIndex].notes;
  // }

  // const curNoteToModify = useSelector((state: Rootstate) => state.modifyNote);
  // const [keyGenerator, setKeyGenerator] = useState<number>(curTrackInfos.length);

  console.log("RENDERING ARR VIEW", curTrackInfos);
  //console.log(curNoteToModify);

  return (
    //List the tracks here
    <div key="arrangementViewContainer" className="arrangementViewContainer">
      <div key="trackHeaders" className="trackHeaderColumn">
        {curTrackInfos.tracks.map((item) => {
          return (
            <Track
              key={item.dataKey}
              dataKey={item.dataKey}
              trackName={item.name}
              trackColor={item.color}
              instrumentName={item.instrument}
              curNoteToModify={
                curTrackInfos.modifiedNote !== null
                  ? curTrackInfos.modifiedNote.trackDataKey === item.dataKey
                    ? curTrackInfos.modifiedNote
                    : null
                  : null
              }
              curMidiClipToModify={
                curTrackInfos.modifiedMidiClip !== null
                ? curTrackInfos.modifiedMidiClip.trackDataKey === item.dataKey
                  ? curTrackInfos.modifiedMidiClip
                  : curTrackInfos.modifiedMidiClip.newMidiClipProps !== undefined
                    ? curTrackInfos.modifiedMidiClip.newMidiClipProps.trackKey === item.dataKey
                      ? curTrackInfos.modifiedMidiClip
                      : null
                    : null
                : null
              }
              //midiClips={item.midiClips}
            />
          );
        })}
        <NewTrackModal showModal={showModal} setShowModal={setShowModal} mode="add" />
        <button
          className="addNewTrackButton"
          onClick={() => setShowModal(true)}
        >
          <img className="addNewTrackImg" src={addButton} alt="" width="15px" />
          Új sáv...
        </button>
      </div>
      <ArrangementCanvas
        // TODO: elég ha a midiclip azon paramétereit adjuk át, ami elég az elhelyezéséhez.
        // A piano roll tudni fogja, hogy miylen noteok lesznek benne, ezért az arr canvasnak nem kell ezt tudnia
        midiClips={curTrackInfos.tracks
          .map((track) => {
            return track.midiClips;
          })
          .flat()}
        numOfTracks={curTrackInfos.tracks.length}
      />
    </div>
  );
}

export default ArrangementView;
