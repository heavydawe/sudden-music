import { MidiClip } from "../Interfaces";

const CurTracksReducer = (
  state: {
    trackName: string;
    // Instrument props here as well (for example: attack or release)?
    midiClips: MidiClip[];
  }[] = [],
  action: {
    type: string;
    payload: string;
  }
) => {
  switch (action.type) {
    case "ADD_NEW_TRACK":
      return [...state, action.payload];

    case "ADD_NOTE":
      // Add a new note, find the correct track
      return;


    case "DELETE_NOTE":
      // use filter here
      return;

    case "UPDATE_NOTE":
      // get the specific note id, find it, then update it
      return;
  }

  // switch (action.type) {
  //   case 'ADD_NEW_TRACK':
  //     //do something

  //     return
  //       ...state,
  //       action

  //   default:
  //     return state;
  // }

  // bindActionCreators.
};

export default CurTracksReducer;
