import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { SampleProps } from "../../Interfaces";
import "./AudioSampler.css";
import powerOnButton from "../../Icons/powerOnButton.png";
import powerOffButton from "../../Icons/powerOffButton.png";

interface Props {
  sampleProps: SampleProps;
}

function handlePowerButton(
  isOn: boolean,
  setIsOn: React.Dispatch<React.SetStateAction<boolean>>,
  powerButtonRef: React.RefObject<HTMLImageElement>
) {
  if (isOn) {
    powerButtonRef.current!.src = powerOffButton;
    setIsOn(false);
  } else {
    powerButtonRef.current!.src = powerOnButton;
    setIsOn(true);
  }
}

function AudioSampler(props: Props) {
  const [isOn, setIsOn] = useState<boolean>(false);
  const [curEvent, setCurEvent] = useState<number>(-1);
  const powerButtonRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (curEvent === -1 && isOn) {
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
              const eventID = Tone.Transport.scheduleRepeat(
                (time) => {
                  sampler.triggerAttackRelease("C4", "8n", time);
                },
                `${props.sampleProps.sampleRepeatTime}i`,
                `${props.sampleProps.sampleStartTime}i`
              );
              setCurEvent(eventID);
            },
          }).toDestination();
        })
        .catch((error) => console.log(error));
    } else if (!isOn && curEvent !== -1) {
      Tone.Transport.clear(curEvent);
      setCurEvent(-1);
    }
  }, [props.sampleProps, curEvent, isOn]);

  return (
    <div className="audioSampler">
      <span>{props.sampleProps.sampleName}</span>
      <img
        src={powerOffButton}
        alt="powerButton"
        ref={powerButtonRef}
        onClick={() => handlePowerButton(isOn, setIsOn, powerButtonRef)}
      />
    </div>
  );
}

export default AudioSampler;
