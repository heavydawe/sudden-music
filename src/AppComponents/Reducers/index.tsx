import { combineReducers } from 'redux';
import CurTracksReducer from './CurTracksReducer';
import SelectedMidiClipReducer from './SelectedMidiClipReducer';
import ArrCanvasPropsReducer from './ArrCanvasPropsReducer';
import PianoRollCanvasPropsReducer from './PianoRollCanvasPropsReducer';
import CurTransportPositionReducer from './CurTransportPositionReducer';
import ClearTrackReducer from './ClearTrackReducer';
import ImportPropsReducer from './ImportPropsReducer';

const allReducers = combineReducers({
  curTracks: CurTracksReducer,
  selectedMidiClip: SelectedMidiClipReducer,
  arrCanvasProps: ArrCanvasPropsReducer,
  pianoRollCanvasProps: PianoRollCanvasPropsReducer,
  curTransportPosition: CurTransportPositionReducer,
  disposeTracks: ClearTrackReducer,
  importedProps: ImportPropsReducer,
});

export default allReducers;