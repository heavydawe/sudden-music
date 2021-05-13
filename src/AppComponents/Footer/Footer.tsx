import React, { useRef, useState } from "react";
import ReactModal from "react-modal";
import { useDispatch } from "react-redux";
import {
  changeMidiClipColor,
  changeMidiNoteColor,
  clearEveryTrack,
  exportProject,
  importProject,
  setImportedBPM,
} from "../Actions";
import { appStore, appAuth } from "../firebase";
import { TrackInterface } from "../Interfaces";
import "./Footer.css";

function checkSignUpCredentials(
  emailRef: React.RefObject<HTMLInputElement>,
  nameRef: React.RefObject<HTMLInputElement>,
  passwordRef: React.RefObject<HTMLInputElement>,
  passwordConfirmRef: React.RefObject<HTMLInputElement>
) {
  if (emailRef.current!.validity.valueMissing) {
    alert("Kérlek add meg az email címed!");
    return false;
  }

  if (
    emailRef.current!.value.match(
      /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]{2,}$/
    ) === null
  ) {
    alert("A megadott email cím nem valid!");
    return false;
  }

  if (nameRef.current!.validity.valueMissing) {
    alert("Kérlek adj meg egy felhasználónevet!");
    return false;
  }

  if (nameRef.current!.validity.tooShort) {
    alert(
      "A megadott felhasznólónév túl rövid, 5 - 20 karakterből kell állnia!"
    );
    return false;
  }

  if (passwordRef.current!.validity.valueMissing) {
    alert("Kérlek adj meg egy jelszót!");
    return false;
  }

  if (passwordRef.current!.validity.tooShort) {
    alert("A megadott jelszó túl rövid, 5 - 15 karakterből kell, hogy álljon!");
    return false;
  }

  if (passwordConfirmRef.current!.validity.valueMissing) {
    alert("Kérlek erősítsed meg a jelszavad!");
    return false;
  }

  if (passwordRef.current!.value !== passwordConfirmRef.current!.value) {
    alert("A két megadott jelszó nem egyezik!");
    return false;
  }

  return true;
}

function Footer() {
  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    appAuth.currentUser !== null
  );
  const [isPrefOpen, setIsPrefOpen] = useState<boolean>(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState<boolean>(false);
  const [isSignInOpen, setIsSignInOpen] = useState<boolean>(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);

  const signInEmailRef = useRef<HTMLInputElement>(null);
  const signInPasswordRef = useRef<HTMLInputElement>(null);

  const prefThemeRef = useRef<HTMLSelectElement>(null);
  const prefMidiClipColor = useRef<HTMLInputElement>(null);
  const prefMidiNoteColor = useRef<HTMLInputElement>(null);

  return (
    <footer>
      {isLoggedIn ? (
        <>
          <button
            onClick={() => {
              appAuth.signOut().catch((error) => {
                alert("Hiba történt kijelentkezéskor!");
                console.log(error);
              });

              const root = document.documentElement;
              root.style.setProperty("--modal-bg-color", "rgb(40, 40, 40)");
              root.style.setProperty("--main-bg-color", "rgb(40, 40, 40)");

              dispatch(changeMidiNoteColor("#6fff00"));
              dispatch(changeMidiClipColor("grey"));
              setIsLoggedIn(false);
            }}
          >
            Kijelentkezés
          </button>
          <button onClick={() => setIsPrefOpen(true)}>Beállítások...</button>
          <ReactModal
            isOpen={isPrefOpen}
            className="prefModal"
            appElement={document.getElementById("App")!}
          >
            <div className="prefModalContainer">
              <div>
                <p>Témaválasztás:</p>
                <br />
                <p>MIDI Clip színe:</p>
                <br />
                <p>MIDI jel színe:</p>
              </div>
              <div>
                <select defaultValue="darkMode" ref={prefThemeRef}>
                  <option value="darkMode">Sötét</option>
                  <option value="darkModeBlue">Sötét kék</option>
                  <option value="fade">Átmenetes 1</option>
                  <option value="fadeFire">Átmenetes 2</option>
                  <option value="warm">Narancs</option>
                </select>
                <br />
                <input type="color" ref={prefMidiClipColor} />
                <br />
                <input type="color" ref={prefMidiNoteColor} />
              </div>
            </div>
            <button
              className="prefModalCancelButton"
              onClick={() => setIsPrefOpen(false)}
            >
              Mégsem
            </button>
            <button
              className="prefModalSaveButton"
              onClick={() => {
                const root = document.documentElement;
                switch (prefThemeRef.current!.value) {
                  case "darkMode":
                    root.style.setProperty(
                      "--main-bg-color",
                      "rgb(40, 40, 40)"
                    );
                    root.style.setProperty(
                      "--modal-bg-color",
                      "rgb(40, 40, 40)"
                    );
                    break;
                  case "darkModeBlue":
                    root.style.setProperty("--main-bg-color", "rgb(0, 0, 26)");
                    root.style.setProperty("--modal-bg-color", "rgb(0, 0, 26)");
                    break;
                  case "warm":
                    root.style.setProperty(
                      "--main-bg-color",
                      "rgb(255, 102, 0)"
                    );
                    root.style.setProperty(
                      "--modal-bg-color",
                      "rgb(255, 102, 0)"
                    );
                    break;
                  case "fadeFire":
                    root.style.setProperty(
                      "--main-bg-color",
                      "linear-gradient(90deg, rgb(255, 102, 0) 0%, rgb(204, 0, 0) 100%)"
                    );
                    root.style.setProperty(
                      "--modal-bg-color",
                      "linear-gradient(90deg, rgb(255, 102, 0) 0%, rgb(204, 0, 0) 100%)"
                    );
                    break;
                  case "fade":
                    root.style.setProperty(
                      "--main-bg-color",
                      "linear-gradient(90deg, rgb(12, 38, 167) 0%, rgb(180, 33, 62) 100%)"
                    );
                    root.style.setProperty(
                      "--modal-bg-color",
                      "linear-gradient(90deg, rgb(12, 38, 167) 0%, rgb(180, 33, 62) 100%)"
                    );
                    break;

                  default:
                    throw Error("Unknown theme!");
                }

                appStore
                  .collection("users")
                  .doc(appAuth.currentUser!.uid)
                  .set({
                    theme: prefThemeRef.current!.value,
                    midiClipColor: prefMidiClipColor.current!.value,
                    midiNoteColor: prefMidiNoteColor.current!.value,
                  })
                  .catch((error) => {
                    alert(
                      "Beállítások elmentésekor valamilyen hiba lépett fel!"
                    );
                    console.log(error);
                  });

                dispatch(changeMidiClipColor(prefMidiClipColor.current!.value));
                dispatch(changeMidiNoteColor(prefMidiNoteColor.current!.value));

                // TODO: firestorera elmentés
                setIsPrefOpen(false);
              }}
            >
              Mentés
            </button>
          </ReactModal>
        </>
      ) : (
        <>
          <button onClick={() => setIsSignInOpen(true)}>Belépés</button>
          <ReactModal
            isOpen={isSignInOpen}
            className="signInModal"
            appElement={document.getElementById("App")!}
          >
            <div className="signInContainer">
              <div>
                <p>Email</p>
                <p>Jelszó</p>
              </div>
              <div>
                <input type="text" ref={signInEmailRef} />
                <input type="password" ref={signInPasswordRef} />
              </div>
            </div>
            <button
              className="signUpModalCancelButton"
              onClick={() => setIsSignInOpen(false)}
            >
              Mégsem
            </button>
            <button
              className="signUpModalSignUpButton"
              onClick={() => {
                appAuth //("dfgsdfg@sdfasdf.asdf", "123456")
                  .signInWithEmailAndPassword(
                    signInEmailRef.current!.value,
                    signInPasswordRef.current!.value
                  )
                  .then((cred) => {
                    setIsLoggedIn(true);
                    setIsSignInOpen(false);
                    appStore
                      .collection("users")
                      .doc(cred.user!.uid)
                      .get()
                      .then((doc) => {
                        const root = document.documentElement;
                        switch (doc.data()!.theme) {
                          case "darkMode":
                            root.style.setProperty(
                              "--main-bg-color",
                              "rgb(40, 40, 40)"
                            );
                            root.style.setProperty(
                              "--modal-bg-color",
                              "rgb(40, 40, 40)"
                            );
                            break;
                          case "fade":
                            root.style.setProperty(
                              "--main-bg-color",
                              "linear-gradient(90deg, rgb(12, 38, 167) 0%, rgb(180, 33, 62) 100%)"
                            );
                            root.style.setProperty(
                              "--modal-bg-color",
                              "linear-gradient(90deg, rgb(12, 38, 167) 0%, rgb(180, 33, 62) 100%)"
                            );
                            break;
                          case "darkModeBlue":
                            root.style.setProperty(
                              "--main-bg-color",
                              "rgb(0, 0, 26)"
                            );
                            root.style.setProperty(
                              "--modal-bg-color",
                              "rgb(0, 0, 26)"
                            );
                            break;
                          case "warm":
                            root.style.setProperty(
                              "--main-bg-color",
                              "rgb(255, 102, 0)"
                            );
                            root.style.setProperty(
                              "--modal-bg-color",
                              "rgb(255, 102, 0)"
                            );
                            break;
                          case "fadeFire":
                            root.style.setProperty(
                              "--main-bg-color",
                              "linear-gradient(90deg, rgb(255, 102, 0) 0%, rgb(204, 0, 0) 100%)"
                            );
                            root.style.setProperty(
                              "--modal-bg-color",
                              "linear-gradient(90deg, rgb(255, 102, 0) 0%, rgb(204, 0, 0) 100%)"
                            );
                            break;

                          default:
                            alert("Hiba történt a háttér betöltésekor!");
                            break;
                        }

                        dispatch(
                          changeMidiClipColor(doc.data()!.midiClipColor)
                        );
                        dispatch(
                          changeMidiNoteColor(doc.data()!.midiNoteColor)
                        );
                      })
                      .catch((error) => {
                        alert("Hiba történt a beállítások betöltésekor!");
                        console.log(error);
                      });
                  })
                  .catch((error) => {
                    if (error.code === "auth/user-not-found") {
                      alert("A megadott email címhez nem tartozik fiók!");
                    } else if (error.code === "auth/wrong-password") {
                      alert("A megadott jelszó nem helyes!");
                    } else {
                      alert(error.code);
                      console.log(error);
                    }
                  });
              }}
            >
              Belépés
            </button>
          </ReactModal>
          <button onClick={() => setIsSignUpOpen(true)}>Regisztráció</button>
          <ReactModal
            isOpen={isSignUpOpen}
            className="signUpModal"
            appElement={document.getElementById("App")!}
          >
            <div className="signUpContainer">
              <div>
                <p>Email</p>
                <p>Név</p>
                <p>Jelszó</p>
                <p>Jelszó megerősítése</p>
              </div>
              <div>
                <input
                  id="email"
                  type="email"
                  autoComplete="off"
                  required={true}
                  ref={emailRef}
                />
                <input
                  id="name"
                  type="text"
                  autoComplete="off"
                  required={true}
                  ref={nameRef}
                  maxLength={20}
                  minLength={5}
                />
                <input
                  id="password"
                  type="password"
                  autoComplete="off"
                  required={true}
                  ref={passwordRef}
                  maxLength={15}
                  minLength={5}
                />
                <input
                  id="password-confirm"
                  type="password"
                  autoComplete="off"
                  required={true}
                  ref={passwordConfirmRef}
                  maxLength={15}
                  minLength={5}
                />
              </div>
            </div>
            <button
              className="signUpModalCancelButton"
              onClick={() => setIsSignUpOpen(false)}
            >
              Mégsem
            </button>
            <button
              className="signUpModalSignUpButton"
              onClick={() => {
                if (
                  checkSignUpCredentials(
                    emailRef,
                    nameRef,
                    passwordRef,
                    passwordConfirmRef
                  )
                ) {
                  appAuth
                    .createUserWithEmailAndPassword(
                      emailRef.current!.value,
                      passwordRef.current!.value
                    )
                    .then((cred) => {
                      appStore.collection("users").doc(cred.user!.uid).set({
                        theme: "darkMode",
                        midiClipColor: "grey",
                        midiNoteColor: "#6fff00",
                      });
                    })
                    .catch((error) => {
                      if (error.code === "auth/email-already-in-use") {
                        alert("Az email címhez már tartozik egy fiók!");
                      } else {
                        alert(error.message);
                      }
                    });
                  setIsSignUpOpen(false);
                }
              }}
            >
              Regisztráció
            </button>
          </ReactModal>
        </>
      )}

      {/* <button>Sign up</button> */}
      <div className="footerRightButtons">
        <button onClick={() => dispatch(exportProject())}>Exportálás...</button>
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

                  // Check if content is fine
                  const fileParts = content.toString().split("\n");

                  if (fileParts.length !== 4) {
                    // throw Error(
                    //   "File has been modified and cannot import it..."
                    // );
                    alert("Nem importálható a fájl!");
                    return;
                  }

                  const importedBPM = +fileParts[3];
                  console.log(importedBPM);

                  if (
                    isNaN(importedBPM) ||
                    Math.trunc(importedBPM) !== importedBPM ||
                    importedBPM < 40 ||
                    importedBPM > 250 
                  ) {
                    alert("Nem importálható a fájl!");
                    return;
                  }

                  const projectToImport = fileParts[2];

                  try {
                    const parsedJSON: any = JSON.parse(projectToImport);

                    if (!isValidProject(parsedJSON)) {
                      alert("Nem importálható a fájl!");
                      return;
                    }

                    //console.log(parsedJSON);
                    dispatch(clearEveryTrack());
                    dispatch(importProject(parsedJSON));
                    dispatch(setImportedBPM(importedBPM));
                  } catch (e) {
                    // throw Error(
                    //   "Cannot parse JSON file, probably due to unwanted modifications to the file..."
                    // );
                    alert("Hiba történt az importáláskor!");
                    return;
                  }
                };

                fileReader.readAsText(file);
              }
            };
            fileSelector.click();
          }}
        >
          Importálás...
        </button>
      </div>
    </footer>
  );
}

export default Footer;

function isValidProject(parsedJSON: any) {
  return (parsedJSON as TrackInterface[]).every((track) => {
    return (
      "dataKey" in track &&
      "name" in track &&
      "instrument" in track &&
      "midiClips" in track &&
      "isMuted" in track
    );
  });
}
