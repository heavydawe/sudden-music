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
  
    default:
      return state;
  }
}

export default CurTransportPositionReducer;