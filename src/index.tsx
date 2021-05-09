import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import allReducer from "./AppComponents/Reducers";
import { createStore } from 'redux';
import { Provider } from 'react-redux';
//import * as Tone from "tone";

const store = createStore(allReducer);

//Tone.setContext(new Tone.Context({ latencyHint : "balanced" }))

document.onkeydown = (e) => {e.stopPropagation()}
document.onkeyup = (e) => {e.stopPropagation()}

ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
