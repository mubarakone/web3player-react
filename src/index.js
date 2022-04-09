import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MoralisProvider } from "react-moralis";

const appId = "CWG11Qpxn8R1QQhMmDpmnxmDvmrWxVvyHTkMrMAf"
const serverUrl = 'https://lncdodnxyziw.usemoralis.com:2053/server'

ReactDOM.render(
  <React.StrictMode >
    <MoralisProvider appId={appId} serverUrl={serverUrl}>
      <App />
    </MoralisProvider>      
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
