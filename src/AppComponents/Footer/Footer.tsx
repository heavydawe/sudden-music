import React, { useState } from "react";
import ReactModal from "react-modal";
import { useDispatch } from "react-redux";
import { exportProject, importProject } from "../Actions";
import "./Footer.css";

function Footer() {
  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isPrefOpen, setIsPrefOpen] = useState<boolean>(false);

  return (
    <footer>
      {isLoggedIn ? (
        <>
          <button onClick={() => setIsLoggedIn(false)}>Log out</button>
          <button onClick={() => setIsPrefOpen(true)}>Preferences...</button>
          <ReactModal isOpen={isPrefOpen} className="prefModal">
            <label htmlFor="name">Név</label>
            <input id="name" type="text" />
            <button
              className="prefModalCancelButton"
              onClick={() => setIsPrefOpen(false)}
            >
              Mégsem
            </button>
            <button className="prefModalSaveButton">Mentés</button>
          </ReactModal>
        </>
      ) : (
        <button onClick={() => setIsLoggedIn(true)}>Log in with Google</button>
      )}

      {/* <button>Sign up</button> */}
      <div className="footerRightButtons">
        <button onClick={() => dispatch(exportProject())}>Export...</button>
        <button
          onClick={() => {
            const fileSelector = document.createElement("input");
            fileSelector.type = "file";
            fileSelector.accept = ".sudden";

            fileSelector.onchange = (e: Event) => {
              if (
                (e.target as HTMLInputElement).files &&
                (e.target as HTMLInputElement).files!.length
              ) {
                const file = (e.target as HTMLInputElement).files![0];
                const fileReader = new FileReader();

                if (!file.name.endsWith(".sudden")) {
                  alert(
                    "A file típusa nem megfelelő, kérlek ellenőrizd, hogy a megfelelőt nyitottad-e meg!"
                  );
                }

                fileReader.onloadend = (e) => {
                  const content = fileReader.result;

                  if (content === undefined || content === null) {
                    alert(
                      "Valami hiba keletkezett a projekt beimportálásakor!"
                    );
                    return;
                  }

                  dispatch(importProject(content.toString()));
                };

                fileReader.readAsText(file);
              }
            };
            fileSelector.click();
          }}
        >
          Import...
        </button>
      </div>
    </footer>
  );
}

export default Footer;
