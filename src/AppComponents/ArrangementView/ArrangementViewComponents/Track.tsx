import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as Tone from "tone";
import {
  clearModifyMidiclip,
  clearModifyNote,
  deleteTrack,
} from "../../Actions";
import {
  ModifyMidiClip,
  ModifyNote,
  // NoteEvent,
} from "../../Interfaces";
import { getInstrument, Instrument } from "./TrackFunctions";
import "./Track.css";
import deleteButton from "../../Icons/deleteButton.png";
import editButton from "../../Icons/editButton.png";
import trackNameIcon from "../../Icons/trackName.png";
import trackInsturmentIcon from "../../Icons/trackInstrument.png";
import NewTrackModal from "./NewTrackModal";

interface NoteMap {
  key: number;
  value: NotePartObject;
}

interface NotePartObject {
  time: string;
  note: string;
  length: string;
}

interface PartInterface {
  part: Tone.Part;
  partNotes: NoteMap[];
}

interface MidiClipMap {
  key: number;
  value: PartInterface;
}

interface Props {
  dataKey: number;
  trackName: string;
  trackColor: string;
  instrumentName: string;
  curNoteToModify: ModifyNote | null;
  curMidiClipToModify: ModifyMidiClip | null;
}

const Track = React.memo((props: Props) => {
  const dispatch = useDispatch();

  // Instrument should be created only once, and change when the user changes it
  const [curInstrument, setCurInstrument] = useState<Instrument>();
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);

  // TODO: INIT correctly when importing
  const [curParts, setCurParts] = useState<MidiClipMap[]>([]);

  // Only change instrument when inited or on user change
  useEffect(() => {
    setCurInstrument(getInstrument(props.instrumentName));
  }, [props.instrumentName]);

  console.log("RENDERING IN TRACK, KEY:", props.dataKey);

  useEffect(() => {
    if (props.curNoteToModify === null) {
      return;
    }

    console.log("IN CURNOTEMODIFY", props.curNoteToModify);

    const stateIndex = curParts.findIndex(
      (part) => part.key === props.curNoteToModify!.midiClipDataKey
    );

    switch (props.curNoteToModify.type) {
      case "ADD":
        console.log("ADDING NEW NOTE");
        const newNote: NotePartObject = {
          time: `${props.curNoteToModify.newNoteProps!.startTime}i`,
          note: props.curNoteToModify.newNoteProps!.note,
          length: `${props.curNoteToModify.newNoteProps!.length}i`,
        };

        // THIS COULD BE PROBLEMATIC... or not..
        curParts[stateIndex].value.part.add(newNote);

        setCurParts((prevState) => [
          ...prevState.slice(0, stateIndex),
          {
            ...prevState[stateIndex],
            value: {
              ...prevState[stateIndex].value,
              partNotes: [
                ...prevState[stateIndex].value.partNotes,
                {
                  key: props.curNoteToModify!.newNoteProps!.dataKey,
                  value: newNote,
                },
              ],
            },
          },
          ...prevState.slice(stateIndex + 1),
        ]);
        break;

      case "DELETE":
        console.log("DELETING NOTE");

        const noteToDeleteIndex = curParts[
          stateIndex
        ].value.partNotes.findIndex(
          (note) => note.key === props.curNoteToModify!.noteDataKey
        );

        // THIS COULD BE PROBLEMATIC.... or not...
        curParts[stateIndex].value.part.remove(
          curParts[stateIndex].value.partNotes[noteToDeleteIndex].value
        );

        setCurParts((prevState) => [
          ...prevState.slice(0, stateIndex),
          {
            ...prevState[stateIndex],
            value: {
              ...prevState[stateIndex].value,
              partNotes: [
                ...prevState[stateIndex].value.partNotes.slice(
                  0,
                  noteToDeleteIndex
                ),
                ...prevState[stateIndex].value.partNotes.slice(
                  noteToDeleteIndex + 1
                ),
              ],
            },
          },
          ...prevState.slice(stateIndex + 1),
        ]);

        break;

      case "UPDATE":
        console.log("UPDATING NOTE");

        const noteToUpdateIndex = curParts[
          stateIndex
        ].value.partNotes.findIndex(
          (note) => note.key === props.curNoteToModify!.noteDataKey
        );

        // THIS COULD BE PROBLEMATIC.... TODO: IT SEEMS TO BE, CHECK IT!
        curParts[stateIndex].value.part.remove(
          curParts[stateIndex].value.partNotes[noteToUpdateIndex].value
        );

        const updatedNote: NotePartObject = {
          time: `${props.curNoteToModify.newNoteProps!.startTime}i`,
          note: props.curNoteToModify.newNoteProps!.note,
          length: `${props.curNoteToModify.newNoteProps!.length}i`,
        };

        curParts[stateIndex].value.part.add(updatedNote);

        setCurParts((prevState) => [
          ...prevState.slice(0, stateIndex),
          {
            ...prevState[stateIndex],
            value: {
              ...prevState[stateIndex].value,
              partNotes: [
                ...prevState[stateIndex].value.partNotes.slice(
                  0,
                  noteToUpdateIndex
                ),
                {
                  ...prevState[stateIndex].value.partNotes[noteToUpdateIndex],
                  value: updatedNote,
                },
              ],
            },
          },
          ...prevState.slice(stateIndex + 1),
        ]);

        break;

      default:
        throw Error("Unknown curNoteToModify type!");
    }

    dispatch(clearModifyNote());
  }, [props.curNoteToModify, curParts, dispatch]);

  useEffect(() => {
    if (props.curMidiClipToModify === null) {
      return;
    }

    console.log("IN CURMIDICLIPTOMODIFY", props.curMidiClipToModify);

    switch (props.curMidiClipToModify.type) {
      case "ADD":
        console.log("ADDING NEW MIDICLIP");
        const newPart = new Tone.Part((time, value) => {
          curInstrument!.triggerAttackRelease(value.note, value.length, time);
          console.log("in callback");
        }).start(`${props.curMidiClipToModify.newMidiClipProps!.startTime}i`);

        setCurParts((prevState) => [
          ...prevState,
          {
            key: props.curMidiClipToModify!.newMidiClipProps!.dataKey,
            value: {
              part: newPart,
              partNotes: [],
            },
          },
        ]);
        break;

      default:
        throw Error("Unknown curMidiClipToModify type!");
    }

    dispatch(clearModifyMidiclip());
  }, [props.curMidiClipToModify, curInstrument, dispatch]);

  return (
    <div className="trackHeader">
      <div className="trackHeaderContainer">
        <div>
          <img
            className="trackHeaderInstrumentNameImg"
            src={trackNameIcon}
            alt=""
          />
          <br />
          <img
            className="trackHeaderInstrumentNameImg"
            src={trackInsturmentIcon}
            alt=""
          />
        </div>
        <div>
          <span className="trackHeaderTitle">{props.trackName}</span>
          <br />
          <span className="trackHeaderInstrumentName">
            {props.instrumentName}
          </span>
        </div>
      </div>
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
