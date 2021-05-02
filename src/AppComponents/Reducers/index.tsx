import { combineReducers } from 'redux';
import CurTracksReducer from './CurTracksReducer';
import authReducer from './authReducer';
import ModifyNoteReducer from './ModifyNoteReducer';
import SelectedMidiClipReducer from './SelectedMidiClipReducer';

const allReducers = combineReducers({
  curTracks: CurTracksReducer,
  selectedMidiClip: SelectedMidiClipReducer,
  modifyNote: ModifyNoteReducer,
  curUser: authReducer,
});

export default allReducers;