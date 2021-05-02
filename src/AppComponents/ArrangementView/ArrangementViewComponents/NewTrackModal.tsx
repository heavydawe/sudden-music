import { useRef } from "react";
import ReactModal from "react-modal";
import { useDispatch } from "react-redux";
import { addNewTrack, changeTrackProps } from "../../Actions";

interface Props {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  mode: string;
  trackKey?: number;
}

function NewTrackModal(props: Props) {
  const newTrackNameRef = useRef<HTMLInputElement>(null);
  const newTrackInstrumentRef = useRef<HTMLSelectElement>(null);
  const newTrackColorRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();

  return (
    <ReactModal
      isOpen={props.showModal}
      className="newTrackModal"
      appElement={document.getElementById("App")!}
    >
      <label htmlFor="newTrackNameInput">Név</label>
      <input
        key="newTrackNameInput"
        id="newTrackNameInput"
        type="text"
        maxLength={20}
        minLength={5}
        required={true}
        ref={newTrackNameRef}
      />
      <br />
      <label htmlFor="newTrackInstrumentSelect">Hangszer</label>
      <select
        id="newTrackInstrumentSelect"
        key="newTrackInstrumentSelect"
        defaultValue="PolySynth"
        ref={newTrackInstrumentRef}
      >
        <option value="AMSynth">AMSynth</option>
        <option value="DuoSynth">DuoSynth</option>
        <option value="FMSynth">FMSynth</option>
        <option value="MembraneSynth">MembraneSynth</option>
        <option value="MonoSynth">MonoSynth</option>
        <option value="PluckSynth">PluckSynth</option>
        <option value="PolySynth">PolySynth</option>
        <option value="Sampler">Sampler</option>
        <option value="Synth">Synth</option>
      </select>
      <br />
      <label htmlFor="newTrackColor">Szín</label>
      <input
        key="newTrackColor"
        id="newTrackColor"
        type="color"
        required={true}
        ref={newTrackColorRef}
      />
      <button
        className="newTrackModalCancelButton"
        onClick={() => {
          props.setShowModal(false);
        }}
      >
        Mégsem
      </button>
      <button
        className="newTrackModalAddButton"
        onClick={() => {
          if (newTrackNameRef.current!.validity.valueMissing) {
            alert("Kérlek adj az új sávnak nevet!");
            return;
          }

          if (newTrackNameRef.current!.validity.tooShort) {
            alert("Kérlek az új sávnak a neve legalább 5 karakter legyen!");
            return;
          }

          if (props.mode === "add") {
            dispatch(
              addNewTrack({
                dataKey: -1,
                midiClips: [],
                color: "red", // newTrackColorRef.current!.value
                instrument: newTrackInstrumentRef.current!.value,
                name: newTrackNameRef.current!.value,
              })
            );
          } else {
            dispatch(
              changeTrackProps(props.trackKey!, {
                name: newTrackNameRef.current!.value,
                color: newTrackColorRef.current!.value,
                instrument: newTrackInstrumentRef.current!.value,
              })
            );
          }
          props.setShowModal(false);
        }}
      >
        {props.mode === "add" ? "Hozzáadás" : "Mentés"}
      </button>
    </ReactModal>
  );
}

export default NewTrackModal;
