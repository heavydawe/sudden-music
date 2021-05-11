import {
  ModifyMidiClip,
  ModifyNote,
  TrackInterface,
  TrackProps,
} from "../Interfaces";

const CurTracksReducer = (
  state: {
    tracks: TrackInterface[];
    modifiedNote: ModifyNote | null;
    modifiedMidiClip: ModifyMidiClip | null;
  } = {
    tracks: [
      {
        dataKey: 0,
        // color: "blue",
        instrument: "PolySynth",
        midiClips: [],
        name: "test_a",
        isMuted: false,
      },
      {
        dataKey: 1,
        // color: "blue",
        instrument: "PolySynth",
        midiClips: [],
        name: "test_b",
        isMuted: false,
      },
      {
        dataKey: 2,
        // color: "blue",
        instrument: "PolySynth",
        midiClips: [],
        name: "test_0",
        isMuted: false,
      },
      {
        dataKey: 3,
        // color: "blue",
        instrument: "PolySynth",
        midiClips: [],
        name: "test_1",
        isMuted: false,
      },
      {
        dataKey: 4,
        // color: "red",
        instrument: "PolySynth",
        midiClips: [],
        name: "test_2",
        isMuted: false,
      },
    ],
    modifiedNote: null,
    modifiedMidiClip: null,
  },
  action: {
    type: string;
    trackIndex: number;
    payload?: string;
    newTrackProps: TrackProps;
    modifyTrack?: TrackInterface;
    modifyNote?: ModifyNote;
    modifyMidiClip?: ModifyMidiClip;
  }
) => {
  switch (action.type) {
    case "EXPORT_PROJECT":
      const element = document.createElement("a");
      const file = new Blob(
        [
          "!!!WARNING!!!\nDO NOT MODIFY THIS FILE OR THE PROJECT MIGHT NOT LOAD CORRECTLY!\n" +
            JSON.stringify(state.tracks),
        ],
        { type: "text/plain" }
      );
      element.href = URL.createObjectURL(file);
      element.download = "SuddenMusicProject.sudden";
      element.click();

      return state;

    case "IMPORT_PROJECT":
      if (action.payload === undefined) {
        throw Error("Payload is missing when importing");
      }

      const fileParts = action.payload.split("\n");

      if (fileParts.length !== 3) {
        throw Error("File has been modified and cannot import it...");
      }

      const projectToImport = fileParts[2];

      // TODO: fix piano roll then check importing again, midiclips were not showing correctly

      try {
        console.log(JSON.parse(projectToImport));
        return {
          tracks: JSON.parse(projectToImport),
          modifiedNote: null,
          modifiedMidiClip: null,
        };
      } catch (e) {
        throw Error(
          "Cannot parse JSON file, probably due to unwanted modifications to the file..."
        );
      }

    case "ADD_NEW_TRACK":
      if (action.modifyTrack === undefined) {
        throw Error("Track missing!");
      }

      if (!state.tracks.length) {
        return {
          tracks: [
            {
              dataKey: 0,
              name: action.modifyTrack.name,
              // color: action.modifyTrack.color,
              instrument: action.modifyTrack!.instrument,
              midiClips: [],
            },
          ],
          modifiedNote: null,
          modifiedMidiClip: null,
        };
      }

      const maxDataKey = state.tracks[state.tracks.length - 1].dataKey;

      return {
        tracks: [
          ...state.tracks,
          {
            dataKey: maxDataKey + 1,
            name: action.modifyTrack.name,
            // color: action.modifyTrack.color,
            instrument: action.modifyTrack!.instrument,
            midiClips: [],
          },
        ],
        modifiedNote: null,
        modifiedMidiClip: null,
      };

    case "DELETE_TRACK":
      const trackToDeleteIndex = state.tracks.findIndex(
        (track) => track.dataKey === action.trackIndex
      );

      return {
        tracks: [
          ...state.tracks.slice(0, trackToDeleteIndex),
          ...state.tracks.slice(trackToDeleteIndex + 1).map((track) => {
            return {
              ...track,
              dataKey: track.dataKey - 1,
              midiClips: track.midiClips.map((midiClip) => {
                return {
                  ...midiClip,
                  trackKey: midiClip.trackKey - 1,
                };
              }),
            };
          }),
        ],
        modifiedNote: null,
        modifiedMidiClip: null,
      };

    case "CHANGE_TRACK_PROPS":
      if (action.newTrackProps === undefined) {
        throw Error("NewTrackProps is missing when editing track");
      }

      const trackToChangeIndex = state.tracks.findIndex(
        (track) => track.dataKey === action.trackIndex
      );

      return {
        tracks: [
          ...state.tracks.slice(0, trackToChangeIndex),
          {
            ...state.tracks[trackToChangeIndex],
            name: action.newTrackProps.name,
            // color: action.newTrackProps.color,
            instrument: action.newTrackProps.instrument,
          },
          ...state.tracks.slice(trackToChangeIndex + 1),
        ],
        modifiedNote: null,
        modifiedMidiClip: null,
      };

    case "CLEAR_MODIFY_NOTE":
      return {
        ...state,
        modifiedNote: null,
      };

    case "CLEAR_MODIFY_MIDICLIP":
      return {
        ...state,
        modifiedMidiClip: null,
      };

    case "CHANGE_INSTRUMENT":
      return {
        tracks: [
          ...state.tracks.slice(0, action.trackIndex),
          {
            ...state.tracks[action.trackIndex],
            instrument: action.payload,
          },
          ...state.tracks.slice(action.trackIndex + 1),
        ],
        modifiedNote: null,
        modifiedMidiClip: null,
      };

    case "ADD_MIDI_CLIP":
      if (action.modifyMidiClip === null) {
        throw Error("ModifyMidiClip is missing");
      }

      if (action.modifyMidiClip!.newMidiClipProps === null) {
        throw Error("NewMidiClipProps is missing");
      }

      const addedMidis = [
        ...state.tracks[action.trackIndex].midiClips,
        action.modifyMidiClip!.newMidiClipProps,
      ];

      return {
        tracks: [
          ...state.tracks.slice(0, action.trackIndex),
          {
            ...state.tracks[action.trackIndex],
            midiClips: addedMidis,
          },
          ...state.tracks.slice(action.trackIndex + 1),
        ],
        modifiedNote: null,
        modifiedMidiClip: action.modifyMidiClip,
      };

    case "DELETE_MIDI_CLIP":
      if (action.modifyMidiClip === null) {
        throw Error("ModifyMidiClip is missing");
      }

      const midiClipToDeleteIndex = state.tracks[
        action.trackIndex
      ].midiClips.findIndex(
        (item) => item.dataKey === action.modifyMidiClip!.midiClipDataKey
      );

      return {
        tracks: [
          ...state.tracks.slice(0, action.trackIndex),
          {
            ...state.tracks[action.trackIndex],
            midiClips: [
              ...state.tracks[action.trackIndex].midiClips.slice(
                0,
                midiClipToDeleteIndex
              ),
              ...state.tracks[action.trackIndex].midiClips.slice(
                midiClipToDeleteIndex + 1
              ),
            ],
          },
          ...state.tracks.slice(action.trackIndex + 1),
        ],
        modifiedNote: null,
        modifiedMidiClip: action.modifyMidiClip,
      };

    case "UPDATE_MIDI_CLIP":
      if (action.modifyMidiClip === null) {
        throw Error("ModifyMidiClip is missing");
      }

      if (action.modifyMidiClip!.newMidiClipProps === null) {
        throw Error("NewMidiClipProps is missing");
      }

      const midiClipToUpdateIndex = state.tracks[
        action.trackIndex
      ].midiClips.findIndex(
        (item) => item.dataKey === action.modifyMidiClip!.midiClipDataKey
      );

      if (
        action.modifyMidiClip!.trackDataKey ===
        action.modifyMidiClip!.newMidiClipProps!.trackKey
      ) {
        const updatedMidiClip = [
          ...state.tracks[action.trackIndex].midiClips.slice(
            0,
            midiClipToUpdateIndex
          ),
          {
            ...state.tracks[action.trackIndex].midiClips[midiClipToUpdateIndex],
            trackKey: action.modifyMidiClip!.newMidiClipProps!.trackKey,
            startTime: action.modifyMidiClip!.newMidiClipProps!.startTime,
            length: action.modifyMidiClip!.newMidiClipProps!.length,
          },
          ...state.tracks[action.trackIndex].midiClips.slice(
            midiClipToUpdateIndex + 1
          ),
        ];

        return {
          tracks: [
            ...state.tracks.slice(0, action.trackIndex),
            {
              ...state.tracks[action.trackIndex],
              midiClips: updatedMidiClip,
            },
            ...state.tracks.slice(action.trackIndex + 1),
          ],
          modifiedNote: null,
          modifiedMidiClip: action.modifyMidiClip, //notes will be empty here, no need them to be passed
        };
      } else {
        const newTracks = state.tracks.slice();

        // Make a copy of the midiClip that needs to be moved
        const midiClipToCopy =
          state.tracks[action.trackIndex].midiClips[midiClipToUpdateIndex];

        // TrackKey changed, so delete midiClip from old track
        newTracks[action.trackIndex].midiClips = [
          ...newTracks[action.trackIndex].midiClips.slice(
            0,
            midiClipToUpdateIndex
          ),
          ...newTracks[action.trackIndex].midiClips.slice(
            midiClipToUpdateIndex + 1
          ),
        ];

        // And insert it in the new track
        newTracks[
          action.modifyMidiClip!.newMidiClipProps!.trackKey
        ].midiClips = [
          ...newTracks[action.modifyMidiClip!.newMidiClipProps!.trackKey]
            .midiClips,
          {
            dataKey: midiClipToCopy.dataKey,
            notes: midiClipToCopy.notes,
            length: midiClipToCopy.length,
            startTime: action.modifyMidiClip!.newMidiClipProps!.startTime,
            trackKey: action.modifyMidiClip!.newMidiClipProps!.trackKey,
          },
        ];

        return {
          tracks: newTracks,
          modifiedNote: null,
          modifiedMidiClip: {
            ...action.modifyMidiClip!,
            newMidiClipProps: {
              ...action.modifyMidiClip!.newMidiClipProps,
              notes: midiClipToCopy.notes, 
              // Here we need to pass the notes, so the new track can create the new part
            }
          },
        };
      }

    case "ADD_NOTE":
      if (action.modifyNote === undefined) {
        throw Error("ModifyNote is missing");
      }

      if (action.modifyNote.newNoteProps === undefined) {
        throw Error("NewNoteProps is missing");
      }

      const midiClipIndexAdd = state.tracks[
        action.trackIndex
      ].midiClips.findIndex(
        (item) => item.dataKey === action.modifyNote!.midiClipDataKey
      );

      const addedNotesMidiClip = [
        ...state.tracks[action.trackIndex].midiClips.slice(0, midiClipIndexAdd),
        {
          ...state.tracks[action.trackIndex].midiClips[midiClipIndexAdd],
          notes: [
            ...state.tracks[action.trackIndex].midiClips[midiClipIndexAdd]
              .notes,
            {
              dataKey: action.modifyNote.newNoteProps.dataKey,
              startTime: action.modifyNote.newNoteProps.startTime,
              length: action.modifyNote.newNoteProps.length,
              note: action.modifyNote.newNoteProps.note,
            },
          ],
        },
        ...state.tracks[action.trackIndex].midiClips.slice(
          midiClipIndexAdd + 1
        ),
      ];

      return {
        tracks: [
          ...state.tracks.slice(0, action.trackIndex),
          {
            ...state.tracks[action.trackIndex],
            midiClips: addedNotesMidiClip,
          },
          ...state.tracks.slice(action.trackIndex + 1),
        ],
        modifiedNote: action.modifyNote,
        modifiedMidiClip: null,
      };

    case "DELETE_NOTE":
      if (action.modifyNote === undefined) {
        throw Error("ModifyNote is missing");
      }

      if (action.modifyNote.newNoteProps === undefined) {
        throw Error("NewNoteProps is missing");
      }

      const midiClipIndexDelete = state.tracks[
        action.trackIndex
      ].midiClips.findIndex(
        (item) => item.dataKey === action.modifyNote!.midiClipDataKey
      );

      const noteToDeleteIndex = state.tracks[action.trackIndex].midiClips[
        midiClipIndexDelete
      ].notes.findIndex(
        (item) => item.dataKey === action.modifyNote!.noteDataKey
      );

      const deletedNotesMidiClip = [
        ...state.tracks[action.trackIndex].midiClips.slice(
          0,
          midiClipIndexDelete
        ),
        {
          ...state.tracks[action.trackIndex].midiClips[midiClipIndexDelete],
          notes: [
            ...state.tracks[action.trackIndex].midiClips[
              midiClipIndexDelete
            ].notes.slice(0, noteToDeleteIndex),
            ...state.tracks[action.trackIndex].midiClips[
              midiClipIndexDelete
            ].notes.slice(noteToDeleteIndex + 1),
          ],
        },
        ...state.tracks[action.trackIndex].midiClips.slice(
          midiClipIndexDelete + 1
        ),
      ];

      return {
        tracks: [
          ...state.tracks.slice(0, action.trackIndex),
          {
            ...state.tracks[action.trackIndex],
            midiClips: deletedNotesMidiClip,
          },
          ...state.tracks.slice(action.trackIndex + 1),
        ],
        modifiedNote: action.modifyNote,
        modifiedMidiClip: null,
      };

    case "UPDATE_NOTE":
      if (action.modifyNote === undefined) {
        throw Error("ModifyNote is missing");
      }

      if (action.modifyNote.newNoteProps === undefined) {
        throw Error("NewNoteProps is missing");
      }

      const midiClipIndexUpdate = state.tracks[
        action.trackIndex
      ].midiClips.findIndex(
        (item) => item.dataKey === action.modifyNote!.midiClipDataKey
      );

      const noteToUpdateIndex = state.tracks[action.trackIndex].midiClips[
        midiClipIndexUpdate
      ].notes.findIndex(
        (item) => item.dataKey === action.modifyNote!.noteDataKey
      );

      const updatedNotesMidiClip = [
        ...state.tracks[action.trackIndex].midiClips.slice(
          0,
          midiClipIndexUpdate
        ),
        {
          ...state.tracks[action.trackIndex].midiClips[midiClipIndexUpdate],
          notes: [
            ...state.tracks[action.trackIndex].midiClips[
              midiClipIndexUpdate
            ].notes.slice(0, noteToUpdateIndex),
            {
              dataKey: action.modifyNote.noteDataKey,
              startTime: action.modifyNote.newNoteProps.startTime,
              length: action.modifyNote.newNoteProps.length,
              note: action.modifyNote.newNoteProps.note,
            },
            ...state.tracks[action.trackIndex].midiClips[
              midiClipIndexUpdate
            ].notes.slice(noteToUpdateIndex + 1),
          ],
        },
        ...state.tracks[action.trackIndex].midiClips.slice(
          midiClipIndexUpdate + 1
        ),
      ];

      return {
        tracks: [
          ...state.tracks.slice(0, action.trackIndex),
          {
            ...state.tracks[action.trackIndex],
            midiClips: updatedNotesMidiClip,
          },
          ...state.tracks.slice(action.trackIndex + 1),
        ],
        modifiedNote: action.modifyNote,
        modifiedMidiClip: null,
      };

    default:
      return state;
  }
};

export default CurTracksReducer;
