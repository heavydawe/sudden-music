import React, { useEffect, useRef } from "react";
import * as Tone from "tone";
import "./NavigationBar.css";
import playButton from "../Icons/playButton.png";
import stopButton from "../Icons/stopButton.png";
import pauseButton from "../Icons/pauseButton.png";
import { useDispatch, useSelector } from "react-redux";
import {
  changeArrViewGridPadding,
  changeArrViewNumOfPhrases,
  clearImportedBPM,
} from "../Actions";
import { Rootstate } from "../Interfaces";

function togglePlay(
  buttonRef: React.RefObject<HTMLImageElement>,
  curTransportPosition: number
) {
  if (Tone.Transport.state === "stopped") {
    buttonRef.current!.src = stopButton;
    Tone.start();
    Tone.Transport.start("+0.1", `${curTransportPosition}i`);
    // console.log("Started Transport");
  } else {
    buttonRef.current!.src = playButton;
    Tone.Transport.stop();
    // console.log("Stopped Transport");
  }
}

function togglePause() {
  if (Tone.Transport.state === "started") {
    // console.log("Paused Transport");
    Tone.Transport.pause();
  } else if (Tone.Transport.state === "paused") {
    // console.log("Unpaused Transport");
    Tone.Transport.start();
  }
}

function changeBPM(BPMInputRef: React.RefObject<HTMLInputElement>) {
  if (!/^\d+$/.test(BPMInputRef.current!.value)) {
    alert("A BPM csak számokat tartalmazhat!");
    BPMInputRef.current!.value = "120";
    return;
  }

  const newBPMValue = +BPMInputRef.current!.value;

  if (newBPMValue === Tone.Transport.bpm.value) {
    return;
  }

  if (newBPMValue > 250) {
    BPMInputRef.current!.value = "250";
    alert("A BPM értéke nem lehet nagyobb 250-nél!");
    return;
  }

  if (newBPMValue < 40) {
    BPMInputRef.current!.value = "40";
    alert("A BPM értéke nem lehet kisebb 40-nél!");
    return;
  }

  if (newBPMValue !== Math.trunc(newBPMValue)) {
    BPMInputRef.current!.value = Math.trunc(newBPMValue).toString();
    alert("A BPM értéke csak egész szám lehet!");
    Tone.Transport.bpm.value = Math.trunc(newBPMValue);
    return;
  }

  Tone.Transport.bpm.value = newBPMValue;
}

function NavigationBar() {
  const dispatch = useDispatch();

  // console.log("IN NAV");

  const curTransportPosition = useSelector(
    (state: Rootstate) => state.curTransportPosition
  );

  const importedBPM = useSelector(
    (state: Rootstate) => state.importedProps.BPM
  );

  const playStopButtonRef = useRef<HTMLImageElement>(null);
  const BPMInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (importedBPM === -1) {
      return;
    }

    if (BPMInputRef === null) {
      return;
    }

    BPMInputRef.current!.value = importedBPM.toString();
    Tone.Transport.bpm.value = importedBPM;

    dispatch(clearImportedBPM());
  }, [importedBPM, dispatch]);

  return (
    <nav>
      <button
        onClick={() => togglePlay(playStopButtonRef, curTransportPosition)}
      >
        <img src={playButton} alt="Play" width="10px" ref={playStopButtonRef} />
      </button>
      <button onClick={() => togglePause()}>
        <img src={pauseButton} alt="Pause" width="10px" />
      </button>
      <span>BPM:</span>
      <input
        type="number"
        id="BPMInput"
        ref={BPMInputRef}
        min={40}
        max={250}
        defaultValue={120}
        onKeyUp={(e) => e.key === "Enter" && changeBPM(BPMInputRef)}
        onBlur={() => changeBPM(BPMInputRef)}
      />
      <span>Félperiódusok száma:</span>
      <select
        defaultValue="4"
        id="numOfPhrases"
        onChange={(e) => {
          if (Tone.Transport.state === "started") {
            togglePlay(playStopButtonRef, curTransportPosition);
          }
          dispatch(changeArrViewNumOfPhrases(+e.target.value));
        }}
      >
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="4">4</option>
        <option value="8">8</option>
        <option value="16">16</option>
        <option value="32">32</option>
      </select>
      <span>Rácsok sűrűsége:</span>
      <select
        defaultValue="16"
        onChange={(e) => {
          if (Tone.Transport.state === "started") {
            togglePlay(playStopButtonRef, curTransportPosition);
          }
          dispatch(changeArrViewGridPadding(+e.target.value));
        }}
      >
        <option value="4">4</option>
        <option value="8">8</option>
        <option value="16">16</option>
        <option value="32">32</option>
        <option value="64">64</option>
      </select>
    </nav>
  );
}

export default NavigationBar;
