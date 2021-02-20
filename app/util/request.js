import axios from 'axios';
import commonUrl from '../config';
import noAuth from './noAuth';
const requestByPost = (url, data, successCallback, goHome) => {
    axios.post(`${commonUrl}/${url}`, data)
        .then(res => {
            //noAuth(res.data, window.location.href = '/login');
            noAuth(res.data, goHome);
            if (typeof successCallback === "function") {
                successCallback(res);
            }
        })
};

export {
    requestByPost
}