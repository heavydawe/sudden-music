import { MidiClip } from "../Interfaces";

type stateSetter = React.Dispatch<React.SetStateAction<MidiClip[]>>;

interface TrackAndSetterPair {
  trackDataKey: number;
  trackStateSetter: stateSetter;
}

const testReducer = (
  state: TrackAndSetterPair[],
  action: {
    type: string;
    payload: { key: number; value: stateSetter };
  }
) => {
  switch (action.type) {
    case "ADD_NEW":
      return [
        ...state,
        {
          trackDataKey: action.payload.key,
          trackStateSetter: action.payload.value,
        },
      ];

    case "DELETE":
      //use filter to delete element

      return;

    default:
      return state;
  }
};

export default testReducer;
