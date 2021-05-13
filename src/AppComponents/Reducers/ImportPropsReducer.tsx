const ImportPropsReducer = (
  state: {
    BPM: number;
  } = {
    BPM: -1,
  },
  action: {
    type: string;
    payload: number;
  }
) => {

  switch (action.type) {
    case "SET_IMPORTED_BPM":
      return {
        ...state,
        BPM: action.payload
      }

    case "CLEAR_IMPORTED_BPM":
      return {
        ...state,
        BPM: -1,
      }
  
    default:
      return state;
  }
}

export default ImportPropsReducer;