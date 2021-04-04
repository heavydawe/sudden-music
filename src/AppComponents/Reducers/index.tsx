import { combineReducers } from 'redux';
import SelectViewReducer from "./SelectViewReducer"


const allReducers = combineReducers({
  selectView: SelectViewReducer
});

export default allReducers;