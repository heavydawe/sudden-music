import { useRef } from "react";
import ReactModal from "react-modal";
import { useDispatch } from "react-redux";
import { addNewTrack, changeTrackProps } from "../../Actions";
import "./NewTrackModal.css";

interface Props {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  mode: string;
  trackKey?: number;
  instrument?: string;
  nextTrackReactKey?: number;
  setNextTrackReactKey?: React.Dispatch<React.SetStateAction<number>>;
}

function NewTrackModal(props: Props) {
  const newTrackNameRef = useRef<HTMLInputElement>(null);
  const newTrackInstrumentRef = useRef<HTMLSelectElement>(null);

  const dispatch = useDispatch();

  return (
    <ReactModal
      isOpen={props.showModal}
      className="newTrackModal"
      appElement={document.getElementById("App")!}
    >
      <div className="newTrackModalContainer">
        <div>
          <p>Név</p>
          <p>Hangszer</p>
        </div>
        <div>
          <input
            key="newTrackNameInput"
            id="newTrackNameInput"
            autoComplete="off"
            type="text"
            maxLength={20}
            minLength={5}
            required={true}
            ref={newTrackNameRef}
          />
          <br />
          <select
            id="newTrackInstrumentSelect"
            key="newTrackInstrumentSelect"
            defaultValue={props.instrument ? props.instrument : "PolySynth"}
            ref={newTrackInstrumentRef}
            disabled={
              props.instrument ? props.instrument === "PolySynth" : false
            }
          >
            <option value="AMSynth">AMSynth</option>
            <option value="DuoSynth">DuoSynth</option>
            <option value="FMSynth">FMSynth</option>
            <option value="MembraneSynth">MembraneSynth</option>
            <option value="MetalSynth">MetalSynth</option>
            <option value="MonoSynth">MonoSynth</option>
            <option value="PluckSynth">PluckSynth</option>
            <option value="PolySynth">PolySynth</option>
            <option value="Synth">Synth</option>
          </select>
        </div>
      </div>
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

          if (newTrackNameRef.current!.value.length < 5) {
            alert("Kérlek az új sávnak a neve legalább 5 karakter legyen!");
            return;
          }

          if (props.mode === "add") {
            
            if (
              props.setNextTrackReactKey === undefined ||
              props.nextTrackReactKey === undefined
            ) {
              throw Error("Next trackReactKey is undefined!");
            }

            dispatch(
              addNewTrack({
                reactKey: props.nextTrackReactKey,
                dataKey: -1,
                midiClips: [],
                instrument: newTrackInstrumentRef.current!.value,
                name: newTrackNameRef.current!.value,
              })
            );
            props.setNextTrackReactKey(props.nextTrackReactKey + 1);
          } else {
            dispatch(
              changeTrackProps(props.trackKey!, {
                name: newTrackNameRef.current!.value,
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
