import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Root from '../src/client/Root';
import * as serviceWorker from './serviceWorker';
import Promise from 'promise-polyfill';

if(!window.Promise){
    window.Promise = Promise;
}

ReactDOM.render(<Root />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
