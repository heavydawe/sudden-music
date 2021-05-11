import { useEffect } from "react";
import * as Tone from "tone";
import { SampleProps } from "../../Interfaces";
import "./AudioSampler.css"

interface Props {
  sampleProps: SampleProps;
}

function AudioSampler(props: Props) {
  
  useEffect(() => {
    const context = new AudioContext();

    fetch(props.sampleProps.samplePath)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => context.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        const sampler = new Tone.Sampler({
          urls: {
            C4: audioBuffer,
          },
          onload: () => {
            Tone.Transport.scheduleRepeat((time) => {
              sampler.triggerAttackRelease("C4", "8n", time);
            }, `${props.sampleProps.sampleRepeatTime}i`, `${props.sampleProps.sampleStartTime}i`);
          },
        }).toDestination();
      })
      .catch((error) => console.log(error));
  }, [props.sampleProps]);

  return (
    <div className="audioSampler">
      <span>{props.sampleProps.sampleName}</span>
    </div>
  );
}

export default AudioSampler;
