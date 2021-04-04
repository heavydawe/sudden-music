export const selectNewView = (newView: string) => {
  return {
    type: "SELECT_VIEW",
    payload: newView,
  };
};

export const addToTest = (namespace: string, newKey: string, newValue: number) => {
  return {
    type: `${namespace}/ADD_NEW`,
    payload: { key: newKey, value: newValue },
  };
};
