import React from "react";
import * as Tone from "tone";
import "./NavigationBar.css"

function initSong() {

  Tone.Transport.bpm.value = 125;
  // Tone.Transport.swing = 0;
  // Tone.Transport.PPQ = 192;
  const keys = new Tone.MonoSynth().toDestination();

  // // Repeated 8th notes every 8th note; IMPORTANT: 192i = 4n!! (so 96i = 8n)
  // Tone.Transport.scheduleRepeat(() => {
  //   keys.triggerAttackRelease("C4", 0.05);
  // }, "8n");

  const osc = new Tone.Oscillator().toDestination();
  // repeated event every 8th note
  Tone.Transport.scheduleRepeat((time) => {
    // use the callback time to schedule events
    osc.start(time).stop(time + 0.1);
  }, "96i");
}

function playSong() {
  Tone.start();   // make sure that audio context is running
  Tone.Transport.start(); // 0.1 helps scheduling in advance
  
}

function stopSong() {
  Tone.Transport.stop();
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

  return (
    <nav>
      <button onClick={initSong}>INIT</button>
      <button onClick={playSong}>PLAY</button>
      <button onClick={stopSong}>STOP</button>
    </nav>
  );
}

export default NavigationBar;
