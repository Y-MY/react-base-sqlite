import React from 'react';
import {withRouter} from 'react-router-dom';
import NotFound from './components/NotFound';
import './less/index.less';

import {
    Home,
    Developing
} from './pages';

const App = ({history, location}) => {
    const router = {
        '': <Home/>,
        'home': <Home/>,
        'pdf': <Developing title="PDF"/>,
    };
    const {pathname} = location;
    const path = pathname.split('/')[1];
    return router[path] || <NotFound/>
};
export default withRouter(App);
