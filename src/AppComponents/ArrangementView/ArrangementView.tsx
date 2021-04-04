import Track from "./ArrangementViewComponents/Track";
import './ArrangementView.css'
import ArrangementCanvas from "./ArrangementViewComponents/ArrangementCanvas";
import { useState } from "react";

function ArrangementView() {

  // Stats where track infos are stored

  // needs to be inited when a project is imported
  const [keyGenerator, setKeyGenerator] = useState<number>(0);

  let testTrack = []
  
  testTrack.push({
    dataKey: -2,
    name: "track_1",
    color: "blue",
    instrument: "polySynth",
  });

  testTrack.push({
    dataKey: -1,
    name: "track_2",
    color: "red",
    instrument: "polySynth",
  });

   return (
     //List the tracks here
    <div key="arrangementViewContainer" className="arrangementViewContainer">
      <div key="trackHeaders" className="trackHeaderColumn">
        {testTrack.map((item, i) => {
          return(
            <Track key={item.dataKey} dataKey={item.dataKey} trackName={item.name} trackColor={item.color} instrumentName={item.instrument} />
          );
        })}
      </div>
      <ArrangementCanvas />
    </div>
   );
}

export default ArrangementView;