import { combineReducers } from 'redux';
import CurTracksReducer from './CurTracksReducer';
import ModifyNoteReducer from './ModifyNoteReducer';
import SelectedMidiClipReducer from './SelectedMidiClipReducer';
import ArrCanvasPropsReducer from './ArrCanvasPropsReducer';
import PianoRollCanvasPropsReducer from './PianoRollCanvasPropsReducer';

const allReducers = combineReducers({
  curTracks: CurTracksReducer,
  selectedMidiClip: SelectedMidiClipReducer,
  modifyNote: ModifyNoteReducer,
  arrCanvasProps: ArrCanvasPropsReducer,
  pianoRollCanvasProps: PianoRollCanvasPropsReducer,
});

export default allReducers;