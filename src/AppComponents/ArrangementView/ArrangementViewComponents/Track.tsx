import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as Tone from "tone";
import { clearModifyNote, deleteTrack } from "../../Actions";
import {
  MidiClip,
  ModifyMidiClip,
  ModifyNote,
  NoteEvent,
} from "../../Interfaces";
import { getInstrument, Instrument, updateCurEvents } from "./TrackFunctions";
import "./Track.css";
import deleteButton from "../../Icons/deleteButton.png";
import editButton from "../../Icons/editButton.png";
import ReactModal from "react-modal";
import NewTrackModal from "./NewTrackModal";

interface Props {
  dataKey: number;
  trackName: string;
  trackColor: string;
  instrumentName: string;
  midiClips: MidiClip[];
  curNoteToModify: ModifyNote | null;
  //curMidiClipToModify: ModifyMidiClip | null;
}

const Track = React.memo((props: Props) => {
  const dispatch = useDispatch();

  // Instrument should be created only once, and change when the user changes it
  const [curInstrument, setCurInstrument] = useState<Instrument>();
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  // console.log(curInstrument);

  // We need MidiClipDataKey as well, because NoteDataKeys will only differ inside one MidiClip
  const [curEvents, setCurEvents] = useState<number[]>([]); //NoteEvent[]
  console.log(curEvents);

  // Only change instrument when inited or on user change
  useEffect(() => {
    setCurInstrument(getInstrument(props.instrumentName));
  }, [props.instrumentName]);

  // useEffect(() => {
  //   if (props.curNoteToModify === null) {
  //     //&& props.curMidiClipToModify
  //     return;
  //   }

  //   // TODO: update curEvents here maybe?
  //   if (props.curNoteToModify !== null) {
  //     console.log("IN USEFFECT CURNOTE");
  //     dispatch(clearModifyNote());
  //     // updateCurEvents(
  //     //   props.curNoteToModify,
  //     //   props.midiClips,
  //     //   curInstrument!,
  //     //   curEvents,
  //     //   setCurEvents
  //     // );
  //   }
  // }, [
  //   props.curNoteToModify,
  //   props.midiClips,
  //   curInstrument,
  //   curEvents,
  //   dispatch,
  // ]);

  useEffect(() => {
    if (curInstrument === undefined) {
      return;
    }

    if (!props.midiClips.length) {
      return;
    }

    if (!props.midiClips[0].notes.length) {
      return;
    }

    // TODO: optimize this with modify props
    //Tone.Transport.cancel(0);

    const chord1 = ["D3", "G3"];
    const chord2 = ["F3", "Bb3"];

    if (!(curInstrument instanceof Tone.PolySynth)) {
      return;
    }

    // TODO: use modify props to add/remove notes, or add/remove parts.
    // A part should represent a midiclip, and all the notes inside it should be grouped together
    // using the values parameter for the callback function... LETS GO!
    const part = new Tone.Part(
      (time, value) => {
        // the notes given as the second element in the array
        // will be passed in as the second argument
        curInstrument.triggerAttackRelease(value.note, value.length, time);
      },
      [
        { time: 0, note: chord1, velocity: 0.9, length: "8n" },
        { time: "0:2", note: chord2, velocity: 0.5, length: "4n" },
      ]
    ).start(0);

    props.midiClips.forEach((midiClip) => {
      midiClip.notes.forEach((note) => {
        // setCurEvents((prevState) => [
        //   ...prevState,
        //   Tone.Transport.schedule(() => {
        //     curInstrument.triggerAttackRelease(
        //       note.note,
        //       `${note.length}i`,
        //       `+${note.startTime}i`
        //     );
        //   }, `${midiClip.startTime}i`),
        // ]);
      });
    });
  }, [props.midiClips, curInstrument]);

  // if (curInstrument !== undefined && props.midiClips[0] !== undefined) {
  //   const tempArr = props.midiClips[0].notes.map((note) => {
  //     return {
  //       note: note.note,
  //       duration: `${note.length}i`,
  //       startTime: 000`+${note.startTime}i`,
  //     };
  //   });

  //   if (Tone.Transport.state === "started") {
  //     Tone.Transport.stop();
  //   }

  //   Tone.Transport.cancel(0);
  //   Tone.Transport.scheduleRepeat(() => {
  //     tempArr.forEach((item) => {
  //       const eventID = curInstrument.triggerAttackRelease(
  //         item.note,
  //         item.duration,
  //         item.startTime
  //       );
  //       console.log(eventID);
  //     });
  //   }, "1m");

  //   Tone.Transport.start();
  // }

  console.log("RENDERING IN TRACK, KEY:", props.dataKey);

  // const chord1 = ["D3", "G3"];
  // const chord2 = ["F3", "Bb3"];
  // const chord3 = ["G3", "C4"];
  // const chord4 = ["G#3", "C#4"];

  // const pianoPart = new Tone.Part(
  //   (time, chord) => {
  //     instrument.triggerAttackRelease(chord, "6n", time);
  //   },
  //   [
  //     ["0:0", chord1],
  //     ["0:1", chord2],
  //     ["0:2", chord3],
  //     ["0:3:2", chord1],
  //     ["1:0:2", chord2],
  //     ["1:1:2", chord4],
  //     ["1:2:0", chord3],
  //     ["2:0", chord1],
  //     ["2:1", chord2],
  //     ["2:2", chord3],
  //     ["2:3:2", chord2],
  //     ["3:0:2", chord1],
  //   ]
  // ).start(0);

  // pianoPart.loop = true;
  // pianoPart.loopEnd = "4m";

  return (
    <div className="trackHeader">
      <span className="trackHeaderTitle">{props.trackName}</span>
      <button
        className="trackHeaderEditButton"
        onClick={() => setIsEditOpen(true)}
      >
        <img src={editButton} alt="Edit" />
      </button>
      <button
        className="trackHeaderDeleteButton"
        onClick={() => dispatch(deleteTrack(props.dataKey))}
      >
        <img src={deleteButton} alt="X" />
      </button>
      <NewTrackModal
        showModal={isEditOpen}
        setShowModal={setIsEditOpen}
        mode="edit"
        trackKey={props.dataKey}
      />
    </div>
  );
});

export default Track;
