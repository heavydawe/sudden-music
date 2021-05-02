import { appAuth } from "../firebase";
import firebase from "firebase";

const authReducer = (
  state: string | null = null, //Not sure about string
  action: {
    type: string;
    payload: {
      email: string;
      password: string;
    };
  }
) => {
  switch (action.type) {
    case "SIGN_UP":
      appAuth
        .createUserWithEmailAndPassword(
          action.payload.email,
          action.payload.password
        )
        .catch((error) => {
          if (error.code === "auth/email-already-in-use") {
            alert("Az email címhez már tartozik egy fiók!");
          } else {
            alert(error.message);
          }
        }).then(() => {
          console.log(appAuth.currentUser);
        },() => {console.log("nothing")});

      return state;

    default:
      return state;
  }
};

export default authReducer;
