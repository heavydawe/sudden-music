import { combineReducers } from 'redux';
import CurTracksReducer from './CurTracksReducer';
import ModifyNoteReducer from './ModifyNoteReducer';
import SelectedMidiClipReducer from './SelectedMidiClipReducer';


const allReducers = combineReducers({
  curTracks: CurTracksReducer,
  selectedMidiClip: SelectedMidiClipReducer,
  modifyNote: ModifyNoteReducer,
});

export default allReducers;