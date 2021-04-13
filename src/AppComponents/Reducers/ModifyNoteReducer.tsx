import { ModifyNote } from "../Interfaces";

const ModifyNoteReducer = (
  state: ModifyNote = {
    midiClipDataKey: -10,
    noteDataKey: -10,
    trackDataKey: -10,
    type: "ADD",
  },
  action: {
    type: "ADD" | "DELETE" | "UPDATE";
    payload: ModifyNote;
  }
) => {
  switch (action.type) {
    case "ADD":
      return action.payload;

    case "DELETE":
      return action.payload;

    case "UPDATE":
      return action.payload;

    default:
      return state;
  }
};

export default ModifyNoteReducer;
