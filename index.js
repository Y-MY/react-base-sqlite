import React from 'react';
import ReactDOM from 'react-dom';
import logger from 'redux-logger'
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import {BrowserRouter, HashRouter} from 'react-router-dom';
import 'antd-mobile/dist/antd-mobile.less';
//import 'antd/dist/antd.less';
import App from './app';
import reducers from './app/redux/reducers/index';
import './assets/iconfont/iconfont';

let store = createStore(reducers, applyMiddleware(logger));
ReactDOM.render(
    <Provider store={store}>
        <HashRouter>
            <App/>
        </HashRouter>
    </Provider>,
    document.getElementById('app')
);