import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as Tone from "tone";
import {
  clearImportFlag,
  clearModifyMidiclip,
  clearModifyNote,
  deleteTrack,
  deselectMidiClip,
} from "../../Actions";
import { MidiClip, ModifyMidiClip, ModifyNote } from "../../Interfaces";
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
  instrument: Instrument;
}

interface PartInterface {
  part: Tone.Part;
  partNotes: NoteMap[];
}

interface MidiClipMap {
  key: number;
  length: number;
  value: PartInterface;
}

interface Props {
  dataKey: number;
  trackName: string;
  isMuted: boolean;
  isDisposed: boolean;
  // trackColor: string;
  instrumentName: string;
  curNoteToModify: ModifyNote | null;
  curMidiClipToModify: ModifyMidiClip | null;
  midiClips: MidiClip[] | null; // only used when a project has been imported
}

const Track = React.memo((props: Props) => {
  const dispatch = useDispatch();

  // Instrument should be created only once, and change when the user changes it
  const [curInstrument, setCurInstrument] = useState<Instrument>();
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);

  // TODO: INIT correctly when importing
  const [curParts, setCurParts] = useState<MidiClipMap[]>([]);
  // console.log(`IN TRACK ${props.dataKey}`, curParts);

  // Only change instrument when inited or on user change
  useEffect(() => {
    setCurInstrument(getInstrument(props.instrumentName));
  }, [props.instrumentName]);

  // Update every Parts, when the instrument has changed
  useEffect(() => {
    let newPartNotes: MidiClipMap[] = [];

    // console.log("!!!!NEWINSTR");

    curParts.forEach((midiClipMap) => {
      let newNoteMap: NoteMap[] = [];
      midiClipMap.value.part.clear();

      midiClipMap.value.partNotes.forEach((noteMap) =>
        newNoteMap.push({
          key: noteMap.key,
          value: {
            time: noteMap.value.time,
            length: noteMap.value.length,
            note: noteMap.value.note,
            instrument: curInstrument!,
          },
        })
      );

      newNoteMap.forEach((notePartObject) =>
        midiClipMap.value.part.add(notePartObject.value)
      );

      newPartNotes.push({
        key: midiClipMap.key,
        value: {
          part: midiClipMap.value.part,
          partNotes: newNoteMap,
        },
        length: midiClipMap.length,
      });
    });

    setCurParts(newPartNotes);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curInstrument]);

  // Mute all parts if track is muted
  // TODO if midiclip switches track reducers needs to set mute correctly
  // useEffect(() => {
  //   curParts.forEach((midiClipMap) => {
  //     midiClipMap.value.part.mute = props.isMuted;
  //   })
  // }, [props.isMuted])

  //console.log("RENDERING IN TRACK, KEY:", props.dataKey);

  useEffect(() => {
    if (!props.isDisposed) {
      return;
    }

    curParts.forEach((midiClipMap) => midiClipMap.value.part.dispose());

    // console.log("!!IN DISPOSED");
  }, [props.isDisposed, curParts]);

  useEffect(() => {
    if (curInstrument === undefined) {
      return;
    }

    if (props.midiClips === null) {
      return;
    }

    // Add everything to curParts
    const newCurParts: MidiClipMap[] = props.midiClips.map((midiClip) => {
      const newPart = new Tone.Part((time, value) => {
        value.instrument.triggerAttackRelease(value.note, value.length, time);
      }).start(`${midiClip.startTime}i`);

      return {
        key: midiClip.dataKey,
        length: midiClip.length,
        value: {
          part: newPart,
          partNotes: midiClip.notes.map((note) => {
            const notePart: NotePartObject = {
              note: note.note,
              instrument: curInstrument,
              length: `${note.length}i`,
              time: `${note.startTime}i`,
            };

            newPart.add(notePart);

            return {
              key: note.dataKey,
              value: notePart,
            };
          }),
        },
      };
    });

    // console.log("!!IN IMPORT EFFECT");

    setCurParts(newCurParts);
    dispatch(clearImportFlag());
  }, [props.midiClips, dispatch, curInstrument]);

  useEffect(() => {
    if (props.curNoteToModify === null) {
      return;
    }

    // console.log("IN CURNOTEMODIFY", props.curNoteToModify);

    const stateIndex = curParts.findIndex(
      (part) => part.key === props.curNoteToModify!.midiClipDataKey
    );

    switch (props.curNoteToModify.type) {
      case "ADD":
        // If instrument is not PolySynth, we need to check, if there is
        // a note already in Part with the same startTime
        // if (curInstrument!.name !== "PolySynth") {
        //   const isAllowed = !curParts[stateIndex].value.partNotes.some(
        //     (noteMap) =>
        //       noteMap.value.time ===
        //       `${props.curNoteToModify!.newNoteProps!.startTime}i`
        //   );

        //   if (!isAllowed) {
        //     alert("Csak a PolySynth tud egyszerre több hangot is lejátszani!");
        //     dispatch(
        //       deleteNote({
        //         midiClipDataKey: props.curNoteToModify!.midiClipDataKey,
        //         noteDataKey: props.curNoteToModify!.newNoteProps!.dataKey,
        //         trackDataKey: props.dataKey,
        //         type: "DELETE",
        //       })
        //     );
        //     dispatch(clearModifyNote());
        //     return;
        //   }
        // }

        // console.log("ADDING NEW NOTE");
        const newNote: NotePartObject = {
          time: `${props.curNoteToModify.newNoteProps!.startTime}i`,
          note: props.curNoteToModify.newNoteProps!.note,
          length: `${props.curNoteToModify.newNoteProps!.length}i`,
          instrument: curInstrument!,
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
        // console.log("DELETING NOTE");

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
        // console.log("UPDATING NOTE");

        const noteToUpdateIndex = curParts[
          stateIndex
        ].value.partNotes.findIndex(
          (note) => note.key === props.curNoteToModify!.noteDataKey
        );

        // THIS COULD BE PROBLEMATIC....WORKS FINE!

        curParts[stateIndex].value.part.remove(
          curParts[stateIndex].value.partNotes[noteToUpdateIndex].value
        );

        const updatedNote: NotePartObject = {
          time: `${props.curNoteToModify.newNoteProps!.startTime}i`,
          note: props.curNoteToModify.newNoteProps!.note,
          length: `${props.curNoteToModify.newNoteProps!.length}i`,
          instrument: curInstrument!,
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
                ...prevState[stateIndex].value.partNotes.slice(
                  noteToUpdateIndex + 1
                ),
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
  }, [props.curNoteToModify, curParts, dispatch, curInstrument, props.dataKey]);

  useEffect(() => {
    if (props.curMidiClipToModify === null) {
      return;
    }

    // console.log("IN CURMIDICLIPTOMODIFY", props.curMidiClipToModify);

    switch (props.curMidiClipToModify.type) {
      case "ADD":
        // console.log("ADDING NEW MIDICLIP");
        const newPart = new Tone.Part((time, value) => {
          value.instrument.triggerAttackRelease(value.note, value.length, time);
        }).start(`${props.curMidiClipToModify.newMidiClipProps!.startTime}i`);

        setCurParts((prevState) => [
          ...prevState,
          {
            key: props.curMidiClipToModify!.newMidiClipProps!.dataKey,
            value: {
              part: newPart,
              partNotes: [],
            },
            length: props.curMidiClipToModify!.newMidiClipProps!.length,
          },
        ]);
        break;

      case "DELETE":
        // console.log("DELETING MIDICLIP");

        // Find the index in state
        const midiClipToDeleteIndex = curParts.findIndex(
          (midiClip) =>
            midiClip.key === props.curMidiClipToModify!.midiClipDataKey
        );

        // Remove all event from the Part (MIDI clip) and clear up
        curParts[midiClipToDeleteIndex].value.part.dispose();

        // Update state
        setCurParts((prevState) => [
          ...prevState.slice(0, midiClipToDeleteIndex),
          ...prevState.slice(midiClipToDeleteIndex + 1),
        ]);
        break;

      case "UPDATE":
        // console.log("UPDATING MIDICLIP");

        // Find the index in state
        const midiClipToUpdateIndex = curParts.findIndex(
          (midiClip) =>
            midiClip.key === props.curMidiClipToModify!.midiClipDataKey
        );

        if (
          props.curMidiClipToModify.trackDataKey ===
          props.curMidiClipToModify.newMidiClipProps!.trackKey
        ) {
          // MIDI clip did NOT switch track

          // If size have changed, then we only need to update the length
          // console.log(curParts[midiClipToUpdateIndex]);
          if (
            props.curMidiClipToModify!.newMidiClipProps!.length !==
            curParts[midiClipToUpdateIndex].length
          ) {
            setCurParts((prevState) => [
              ...prevState.slice(0, midiClipToUpdateIndex),
              {
                ...prevState[midiClipToUpdateIndex],
                length: props.curMidiClipToModify!.newMidiClipProps!.length,
              },
              ...prevState.slice(midiClipToUpdateIndex + 1),
            ]);
            break;
          }

          // console.log("NEW START");

          // We have to create a new Part, as the start point cannot be changed
          curParts[midiClipToUpdateIndex].value.part.dispose();

          const newPart = new Tone.Part((time, value) => {
            value.instrument.triggerAttackRelease(
              value.note,
              value.length,
              time
            );
          }).start(`${props.curMidiClipToModify.newMidiClipProps!.startTime}i`);

          // Add each note to newPart
          curParts[midiClipToUpdateIndex].value.partNotes.forEach((note) =>
            newPart.add(note.value)
          );

          // Update state
          setCurParts((prevState) => [
            ...prevState.slice(0, midiClipToUpdateIndex),
            {
              ...prevState[midiClipToUpdateIndex],
              value: {
                ...prevState[midiClipToUpdateIndex].value,
                part: newPart,
              },
            },
            ...prevState.slice(midiClipToUpdateIndex + 1),
          ]);
        } else {
          // MIDI clip switched track
          if (props.curMidiClipToModify.trackDataKey === props.dataKey) {
            // This is the previous track, so we need to delete part from here
            curParts[midiClipToUpdateIndex].value.part.dispose();

            setCurParts((prevState) => [
              ...prevState.slice(0, midiClipToUpdateIndex),
              ...prevState.slice(midiClipToUpdateIndex + 1),
            ]);
          } else {
            // This is the new track, so we need to insert it here
            const newPart = new Tone.Part((time, value) => {
              value.instrument.triggerAttackRelease(
                value.note,
                value.length,
                time
              );
            }).start(
              `${props.curMidiClipToModify.newMidiClipProps!.startTime}i`
            );

            // Get all notes from props
            const newNotes =
              props.curMidiClipToModify.newMidiClipProps!.notes.map((note) => {
                return {
                  key: note.dataKey,
                  value: {
                    time: `${note.startTime}i`,
                    note: note.note,
                    length: `${note.length}i`,
                    instrument: curInstrument!,
                  },
                };
              });

            // Add notes to part
            newNotes.forEach((note) => newPart.add(note.value));

            // Update state, add everything
            setCurParts((prevState) => [
              ...prevState,
              {
                key: props.curMidiClipToModify!.newMidiClipProps!.dataKey,
                value: {
                  part: newPart,
                  partNotes: newNotes,
                },
                length: props.curMidiClipToModify!.newMidiClipProps!.length,
              },
            ]);
          }
        }

        break;

      default:
        throw Error("Unknown curMidiClipToModify type!");
    }

    dispatch(clearModifyMidiclip());
  }, [
    props.curMidiClipToModify,
    curInstrument,
    dispatch,
    curParts,
    props.dataKey,
  ]);

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
        onClick={() => {
          if (window.confirm("Biztosan törölni szeretnéd a sávot?")) {
            curParts.forEach((part) => part.value.part.dispose());
            dispatch(deselectMidiClip());
            dispatch(deleteTrack(props.dataKey));
          }
        }}
      >
        <img src={deleteButton} alt="X" />
      </button>
      <NewTrackModal
        showModal={isEditOpen}
        setShowModal={setIsEditOpen}
        mode="edit"
        trackKey={props.dataKey}
        instrument={curInstrument && curInstrument!.name}
      />
    </div>
  );
});

export default Track;
