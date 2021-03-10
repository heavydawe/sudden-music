const CanvasPropsReducer = (state = [], action: {type: string}) => {

  switch (action.type) {
    case 'SET_PROPS':
      //do something
      return;

    default:
      return state;
  }
};

export default CanvasPropsReducer;