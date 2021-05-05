import React, { useRef } from "react";
import * as Tone from "tone";
import "./NavigationBar.css";
import playButton from "../Icons/playButton.png";
import stopButton from "../Icons/stopButton.png";
import pauseButton from "../Icons/pauseButton.png";
import { useDispatch } from "react-redux";
import { changeArrViewGridPadding, changeArrViewNumOfPhrases } from "../Actions";

// function initSong() {
//   Tone.Transport.bpm.value = 125;
// Tone.Transport.swing = 0;
// Tone.Transport.PPQ = 192;
// const keys = new Tone.MonoSynth().toDestination();

// // Repeated 8th notes every 8th note; IMPORTANT: 192i = 4n!! (so 96i = 8n)
// Tone.Transport.scheduleRepeat(() => {
//   keys.triggerAttackRelease("C4", 0.05);
// }, "8n");

// const osc = new Tone.Oscillator().toDestination();
// // repeated event every 8th note
// Tone.Transport.scheduleRepeat((time) => {
//   // use the callback time to schedule events
// }, "96i");
// }

// function pauseSong() {
//   Tone.Transport.pause();
// }

function togglePlay(buttonRef: React.RefObject<HTMLImageElement>) {
  if (Tone.Transport.state === "stopped") {
    buttonRef.current!.src = stopButton;
    Tone.start();
    Tone.Transport.start();
    console.log("Started Transport");
  } else {
    buttonRef.current!.src = playButton;
    Tone.Transport.stop();
    console.log("Stopped Transport");
  }
}

function togglePause() {
  if (Tone.Transport.state === "started") {
    console.log("Paused Transport");
    Tone.Transport.pause();
  } else if (Tone.Transport.state === "paused") {
    console.log("Unpaused Transport");
    Tone.Transport.start();
  }
}

function changeBPM(BPMInputRef: React.RefObject<HTMLInputElement>) {
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

  const playStopButtonRef = useRef<HTMLImageElement>(null);
  const BPMInputRef = useRef<HTMLInputElement>(null);

  document.onkeypress = (e) => {
    if (e.key === " ") {
      e.preventDefault();
      togglePlay(playStopButtonRef);
    }
  };

  return (
    <nav>
      <button onClick={() => togglePlay(playStopButtonRef)}>
        <img src={playButton} alt="Play" width="10px" ref={playStopButtonRef} />
      </button>
      <button onClick={() => togglePause()}>
        <img src={pauseButton} alt="Pause" width="10px" />
      </button>
      <span>BPM:</span>
      <input
        type="number"
        ref={BPMInputRef}
        min={40}
        max={250}
        defaultValue={120}
        onKeyUp={(e) => e.key === "Enter" && changeBPM(BPMInputRef)}
        onBlur={() => changeBPM(BPMInputRef)}
      />
      <span>Félperiódusok száma:</span>
      <select defaultValue="4" onChange={(e) => dispatch(changeArrViewNumOfPhrases(+e.target.value))}>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="4">4</option>
        <option value="8">8</option>
        <option value="16">16</option>
        <option value="32">32</option>
      </select>
      <span>Vonalak sűrűsége:</span>
      <select defaultValue="16" onChange={(e) => dispatch(changeArrViewGridPadding(+e.target.value))}>
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
