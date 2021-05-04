import React, { useRef } from "react";
import * as Tone from "tone";
import "./NavigationBar.css";
import playButton from "../Icons/playButton.png";
import stopButton from "../Icons/stopButton.png";
import pauseButton from "../Icons/pauseButton.png";

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

  Tone.Transport.bpm.value = newBPMValue;
}

function NavigationBar() {
  // function initSong() {
  //   /**
  //    * PIANO
  //    */
  //   Tone.Transport.bpm.value = 112;
  //   const keys = new Tone.PolySynth(Tone.Synth, {
  //     volume: -8,
  //     oscillator: {
  //       partials: [1, 2, 1],
  //     },
  //   }).toDestination();

  //   const chord1 = ["D3", "G3"];
  //   const chord2 = ["F3", "Bb3"];
  //   const chord3 = ["G3", "C4"];
  //   const chord4 = ["G#3", "C#4"];

  //   const pianoPart = new Tone.Part(
  //     (time, chord) => {
  //       keys.triggerAttackRelease(chord, "6n", time);
  //     },
  //     [
  //       ["0:0", chord1],
  //       ["0:1", chord2],
  //       ["0:2", chord3],
  //       ["0:3:2", chord1],
  //       ["1:0:2", chord2],
  //       ["1:1:2", chord4],
  //       ["1:2:0", chord3],
  //       ["2:0", chord1],
  //       ["2:1", chord2],
  //       ["2:2", chord3],
  //       ["2:3:2", chord2],
  //       ["3:0:2", chord1],
  //     ]
  //   ).start(0);

  //   pianoPart.loop = true;
  //   pianoPart.loopEnd = "4m";
  //   //pianoPart.humanize = true;

  //   /**
  //    * BASS
  //    */
  //   const bass = new Tone.MonoSynth({
  //     volume: -10,
  //   }).toDestination();
  //   const bassPart = new Tone.Part(
  //     (time, chord) => {
  //       bass.triggerAttackRelease(chord, "32n", time);
  //     },
  //     [
  //       ["0:0", "G2"],
  //       ["0:0:2", "G2"],
  //       ["0:1", "G2"],
  //       ["0:1:2", "G2"],
  //       ["0:2", "G2"],
  //       ["0:2:2", "G2"],
  //       ["0:3", "G2"],
  //       ["0:3:2", "G2"],
  //       ["1:0", "G2"],
  //       ["1:0:2", "G2"],
  //       ["1:1", "G2"],
  //       ["1:1:2", "G2"],
  //       ["1:2", "G2"],
  //       ["1:2:2", "G2"],
  //       ["1:3", "G2"],
  //       ["1:3:2", "G2"],
  //       ["2:0", "G2"],
  //       ["2:0:2", "G2"],
  //       ["2:1", "A#2"],
  //       ["2:1:2", "A#2"],
  //       ["2:2", "C3"],
  //       ["2:2:2", "C3"],
  //       ["2:3", "C3"],
  //       ["2:3:2", "A#2"],
  //       ["3:0", "A#2"],
  //       ["3:0:2", "G2"],
  //       ["3:1", "G2"],
  //       ["3:1:2", "G2"],
  //       ["3:2", "G2"],
  //       ["3:2:2", "E2"],
  //       ["3:3", "F2"],
  //       ["3:3:2", "F#2"],
  //     ]
  //   ).start(0);

  //   bassPart.loop = true;
  //   bassPart.loopEnd = "4m";
  //   //bassPart.humanize = true;
  // }

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
    </nav>
  );
}

export default NavigationBar;
