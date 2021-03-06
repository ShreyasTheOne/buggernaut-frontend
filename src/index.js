import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import axios from 'axios';
import * as serviceWorker from './serviceWorker';
import 'semantic-ui-css/semantic.min.css';
import './styles/index.css';

axios.defaults.baseURL = 'http://localhost:8000';
// axios.defaults.baseURL = 'http://192.168.0.106:8000';
axios.defaults.xsrfCookieName = 'buggernaut_csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
