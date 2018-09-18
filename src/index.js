//@flow
import React from 'react';
import ReactDOM from 'react-dom';

const $mountPoint: ?HTMLElement = document.querySelector(
    '[data-app="simple-file-upload"]'
);

if ($mountPoint) {
    ReactDOM.render(<h1>Hallow</h1>, $mountPoint);
}
