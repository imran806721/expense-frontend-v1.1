// No './tracing' import — this stage is metrics-only, with no
// otel-collector for browser-side spans to export to. tracing.js is left
// in src/, just unused, ready to be wired back in for a traces stage.
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
