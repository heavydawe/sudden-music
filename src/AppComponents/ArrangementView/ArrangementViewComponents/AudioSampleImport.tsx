import Kick from "../../Samples/Kick.wav";
import OpenHihat from "../../Samples/OpenHihat.wav";
import Clap from "../../Samples/Clap.wav";
import Ride from "../../Samples/Ride.wav";
import Crash from "../../Samples/Crash.wav";

const samplePaths = [Kick, Clap, OpenHihat, Ride, Crash];
const sampleStartTime = [0, 192, 96, 0, 1440];
const sampleRepeatTime = [192, 384, 192, 96, 1536];
const sampleName = [
  "Lábdob",
  "Taps",
  "Lábcin",
  "Kísérő cintányér",
  "Beütő cintányér",
];

export { samplePaths, sampleStartTime, sampleRepeatTime, sampleName };
