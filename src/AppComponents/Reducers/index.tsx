import { combineReducers } from 'redux';
import CurTracksReducer from './CurTracksReducer';
import authReducer from './authReducer';
import ModifyNoteReducer from './ModifyNoteReducer';
import SelectedMidiClipReducer from './SelectedMidiClipReducer';
import ArrCanvasPropsReducer from './ArrCanvasPropsReducer';

const allReducers = combineReducers({
  curTracks: CurTracksReducer,
  selectedMidiClip: SelectedMidiClipReducer,
  modifyNote: ModifyNoteReducer,
  curUser: authReducer,
  arrCanvasProps: ArrCanvasPropsReducer,
});

export default allReducers;