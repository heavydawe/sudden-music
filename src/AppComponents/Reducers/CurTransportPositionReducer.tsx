const CurTransportPositionReducer = (
  state: number = 0,
  action: {
    type: string;
    payload: number;
  }
) => {
  switch (action.type) {
    case "SET_CUR_TRANSPORT_POSITION":
      return action.payload;

    case "CLEAR_SPACE_EVENT":
      document.onkeydown = null;
      return state;

    default:
      return state;
  }
};

export default CurTransportPositionReducer;
