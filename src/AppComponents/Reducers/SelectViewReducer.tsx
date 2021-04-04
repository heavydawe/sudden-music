const SelectViewReducer = (
  state: string = "arr",
  action: {
    type: string;
    payload: string;
  }
) => {
  switch (action.type) {
    case "SELECT_VIEW":
      return action.payload;

    default:
      return state;
  }
};

export default SelectViewReducer;
