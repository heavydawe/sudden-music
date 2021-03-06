import BodyCanvas from "./BodyCanvas";
// import Cell from "./Cell";
// import Note from "./Note";
import "./PianoRollGrid.css";

function initPianoTile(
  pianoTiles: JSX.Element[],
  note: string,
  octave: number,
  tileColor: string,
  id: number
) {
  pianoTiles.unshift(
    <div
      className={tileColor === "w" ? "pianoTileWhite" : "pianoTileBlack"}
      id={"piano" + id.toString()}
      title={note + octave.toString()}
      key={"piano" + id.toString()}
      onClick={() => {
        console.log("ID: " + id + "; NOTE: " + note + octave.toString());
      }}
    >
      {note + octave.toString()}
    </div>
  );
}

function PianoRollGrid() {
  // const gridLength = 4; // How many measure should appear in piano roll
  // const gridSnapSize = 4; // 1 / (gridSnapSize) => the shortest possible note
  const numberOfGridRows = 120;

  // function getGridId(i: number, j: number, k: number) {
  //   return (
  //     i * gridLength * gridLength -
  //     gridLength * gridLength +
  //     j * gridSnapSize +
  //     k
  //   );
  // }

  // function noteDown(cellKey: number) {
  //   console.log("Got cell: " + cellKey.toString());
  // }

  let pianoTiles: JSX.Element[] = [];
  //const scrollStartRef = useRef<HTMLDivElement>(null);

  for (let i = 0; i < numberOfGridRows; i++) {
    switch (i % 12) {
      case 0:
        initPianoTile(pianoTiles, "C", (i / 12) >> 0, "w", i);
        break;
      case 1:
        initPianoTile(pianoTiles, "C#", (i / 12) >> 0, "b", i);
        break;
      case 2:
        initPianoTile(pianoTiles, "D", (i / 12) >> 0, "w", i);
        break;
      case 3:
        initPianoTile(pianoTiles, "D#", (i / 12) >> 0, "b", i);
        break;
      case 4:
        initPianoTile(pianoTiles, "E", (i / 12) >> 0, "w", i);
        break;
      case 5:
        initPianoTile(pianoTiles, "F", (i / 12) >> 0, "w", i);
        break;
      case 6:
        initPianoTile(pianoTiles, "F#", (i / 12) >> 0, "b", i);
        break;
      case 7:
        initPianoTile(pianoTiles, "G", (i / 12) >> 0, "w", i);
        break;
      case 8:
        initPianoTile(pianoTiles, "G#", (i / 12) >> 0, "b", i);
        break;
      case 9:
        initPianoTile(pianoTiles, "A", (i / 12) >> 0, "w", i);
        break;
      case 10:
        initPianoTile(pianoTiles, "A#", (i / 12) >> 0, "b", i);
        break;
      case 11:
        initPianoTile(pianoTiles, "B", (i / 12) >> 0, "w", i);
        break;
    }
  }

  //TODO: check if thi works properly (I think it only works when react HAS to rebuild this component, and this might be just fine)
  //scrollStartRef.current!.scrollIntoView();

  return (
    <>
      {/* <Note /> */}
      <div id="gridContainer" className="gridContainer" key="gridContainer">
        <div className="pianoTiles" key="pianoTiles">
          {pianoTiles}
        </div>
        <div id="gridBody" className="gridBody" key="gridBody">
          {/* {pianoGrid} */}
          <BodyCanvas />
        </div>
      </div>
    </>
  );
}

export default PianoRollGrid;
