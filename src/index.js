//@flow
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

const $mountPoint: ?HTMLElement = document.querySelector(
    '[data-app="simple-file-upload"]'
);

if ($mountPoint) {
    const globalState = window.__sfuState || {};
    ReactDOM.render(<App {...globalState} />, $mountPoint);
}
