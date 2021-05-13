const ClearTrackReducer = (
  state: boolean = false,
  action: {
    type: string;
    payload: boolean;
  }
) => {
  switch (action.type) {
    case "CLEAR_EVERY_TRACK":
      return true;

    case "TRACKS_CLEARED":
      return false;

    default:
      return state;
  }
};

export default ClearTrackReducer;
