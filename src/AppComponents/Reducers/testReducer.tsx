interface Test {
  [id: string]: number
}

const testReducer = (
  state: Test = {
    "a": 1,
    "b": 2
  },
  action: {
    namespace: string;
    type: string;
    payload: {key: string, value: number};
  }
) => {

  switch (action.type) {
    case `${action.namespace}/ADD_NEW`:
      return state[action.payload.key] = action.payload.value;

    default:
      return state;
  }
};

export default testReducer;
