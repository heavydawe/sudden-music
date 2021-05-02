import React, { useRef, useState } from "react";
import ReactModal from "react-modal";
import { useDispatch } from "react-redux";
import { exportProject, importProject, signUpUser } from "../Actions";
import { appStore, appAuth } from "../firebase";
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

  return (
    <footer>
      {isLoggedIn ? (
        <>
          <button
            onClick={() => {
              appAuth.signOut();
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
                appAuth
                  .signInWithEmailAndPassword("dfgsdfg@sdfasdf.asdf", "123456") //TODO: use refs here
                  .then((cred) => {
                    setIsLoggedIn(true);
                    setIsSignInOpen(false);
                    appStore.collection("users").doc(cred.user!.uid).set({
                      backGroundColor: "fade",
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
                  dispatch(
                    signUpUser(
                      emailRef.current!.value,
                      passwordRef.current!.value
                    )
                  );
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
