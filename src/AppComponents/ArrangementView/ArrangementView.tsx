import Track from "./ArrangementViewComponents/Track";
import "./ArrangementView.css";
import ArrangementCanvas from "./ArrangementViewComponents/ArrangementCanvas";
import { Rootstate } from "../Interfaces";
import { useDispatch, useSelector } from "react-redux";
import addButton from "../Icons/addButton.png";
import { addNewTrack } from "../Actions";
import ReactModal from "react-modal";
import { useState } from "react";
// import { useState } from "react";

function ArrangementView() {
  const dispatch = useDispatch();
  const curTrackInfos = useSelector((state: Rootstate) => state.curTracks);
  const [showModal, setShowModal] = useState<boolean>(false);

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
              midiClips={item.midiClips}
            />
          );
        })}
        <ReactModal isOpen={showModal} className="newTrackModal">
          <label htmlFor="newTrackNameInput">Name</label>
          <input
            key="newTrackNameInput"
            id="newTrackNameInput"
            type="text"
            maxLength={20}
          />
          <br />
          <label htmlFor="newTrackInstrumentSelect">Instrument</label>
          <select id="newTrackInstrumentSelect" key="newTrackInstrumentSelect">
            <option value="AMSynth">AMSynth</option>
            <option value="DuoSynth">DuoSynth</option>
            <option value="FMSynth">FMSynth</option>
            <option value="MembraneSynth">MembraneSynth</option>
            <option value="MonoSynth">MonoSynth</option>
            <option value="PluckSynth">PluckSynth</option>
            <option value="PolySynth" selected={true}>
              PolySynth
            </option>
            <option value="Sampler">Sampler</option>
            <option value="Synth">Synth</option>
          </select>
          <br />
          <label htmlFor="newTrackColor">Color</label>
          <input key="newTrackColor" id="newTrackColor" type="color" />
          <button
            className="newTrackModalCancelButton"
            onClick={() => {
              setShowModal(false);
            }}
          >
            Cancel
          </button>
          <button
            className="newTrackModalAddButton"
            onClick={() => {
              setShowModal(false);
              dispatch(
                addNewTrack({
                  dataKey: -1,
                  midiClips: [],
                  color: "red",
                  instrument: "PolySynth",
                  name: "new_track",
                })
              );
            }}
          >
            Add
          </button>
        </ReactModal>
        <button
          className="addNewTrackButton"
          onClick={() => setShowModal(true)}
        >
          <img className="addNewTrackImg" src={addButton} alt="" width="15px" />
          New track...
        </button>
      </div>
      <ArrangementCanvas
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
