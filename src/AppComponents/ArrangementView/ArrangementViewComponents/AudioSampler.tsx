import * as Tone from "tone";

//https://drive.google.com/file/d/1XbiYyh1VDyFv5smAhMPMiq9SNN3njlkS/view?usp=sharing

function AudioSampler() {

  const URL = "https://tonejs.github.io/audio/casio/A1.mp3";

  const sampler = new Tone.Sampler({
    urls: {
      A1: "https://drive.google.com/uc?export=download&id=1XbiYyh1VDyFv5smAhMPMiq9SNN3njlkS",
    },
    onload: () => {
      //sampler.triggerAttackRelease(["C1"], 0.5);
      Tone.Transport.scheduleRepeat((time) => {
        sampler.triggerAttackRelease("C1", "8n", time)
      }, "4n")
    }
  }).toDestination();

  return (
    <div>
      <p>SAMPLE</p>
    </div>
  );
}

export default AudioSampler;