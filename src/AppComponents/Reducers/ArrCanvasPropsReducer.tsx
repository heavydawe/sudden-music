const ArrCanvasPropsReducer = (
  state: {
    numOfPhrases: number;
    gridPadding: number;
  } = {
    numOfPhrases: 4,
    gridPadding: 16,
  },
  action: {
    type: string;
    payload: number;
  }
) => {
  switch (action.type) {
    case "CHANGE_ARR_VIEW_NUM_OF_PHRASES":
      return {
        ...state,
        numOfPhrases: action.payload,
      };
    
    case "CHANGE_ARR_VIEW_GRID_PADDING":
      return {
        ...state,
        gridPadding: action.payload,
      };

    default:
      return state;
  }
};

export default ArrCanvasPropsReducer;