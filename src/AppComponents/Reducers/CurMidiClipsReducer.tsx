const CurMidiClipsReducer = (state = [], action: {type: string}) => {

  switch (action.type) {
    case 'ADD_MIDI_CLIP':
      //do something
      return;

    default:
      return state;
  }
};

export default CurMidiClipsReducer;