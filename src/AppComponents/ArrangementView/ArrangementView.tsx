import Track from "./ArrangementViewComponents/Track";
import "./ArrangementView.css";
import ArrangementCanvas from "./ArrangementViewComponents/ArrangementCanvas";
import { Rootstate } from "../Interfaces";
import { useSelector } from "react-redux";
// import { useState } from "react";

function ArrangementView() {
  const curTrackInfos = useSelector((state: Rootstate) => state.curTracks);
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
      </div>
      <ArrangementCanvas
        midiClips={curTrackInfos.tracks
          .map((track) => {
            return track.midiClips;
          })
          .flat()}
      />
    </div>
  );
}

export default ArrangementView;
