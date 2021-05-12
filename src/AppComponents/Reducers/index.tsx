import { combineReducers } from 'redux';
import CurTracksReducer from './CurTracksReducer';
import SelectedMidiClipReducer from './SelectedMidiClipReducer';
import ArrCanvasPropsReducer from './ArrCanvasPropsReducer';
import PianoRollCanvasPropsReducer from './PianoRollCanvasPropsReducer';
import CurTransportPositionReducer from './CurTransportPositionReducer';

const allReducers = combineReducers({
  curTracks: CurTracksReducer,
  selectedMidiClip: SelectedMidiClipReducer,
  arrCanvasProps: ArrCanvasPropsReducer,
  pianoRollCanvasProps: PianoRollCanvasPropsReducer,
  curTransportPosition: CurTransportPositionReducer,
});

export default allReducers;