import Track from "./ArrangementViewComponents/Track";
import './ArrangementView.css'
import ArrangementCanvas from "./ArrangementViewComponents/ArrangementCanvas";

function ArrangementView() {

  // Stats where track infos are stored

  let testTrack = []
  
  testTrack.push({
    name: "track_1",
    color: "blue",
    instrument: "polySynth",
  });

  testTrack.push({
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
            <Track key={i} trackName={item.name} trackColor={item.color} instrumentName={item.instrument} />
          );
        })}
      </div>
      <ArrangementCanvas />
    </div>
   );
}

export default ArrangementView;