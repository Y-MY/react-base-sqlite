import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Toast } from 'antd-mobile';
import commonUrl from '../config';
import {resetPath} from '../util/handleHistory';
import Axios from 'axios';
export default (res, goHome) => {
    if (res.code === 'noAuth') {
        localStorage.setItem("loginState", "loginout");
        localStorage.clear();
        if (window.deviceId) {
            Axios.post(`${commonUrl}/app/unBindDeviceInfo.do`, { deviceId: window.deviceId })
                .then(res => {
                    if (res.data.code === 'success') {
                        console.log('******解绑设备成功******')
                    }
                })
        }
        Axios.post(`${commonUrl}/app/appLogout.do`, {})
            .then(res => {
                if (res.data.code === 'success') {
                   // resetPath();
                }
            });
        Toast.fail(res.message, 2, () => { goHome() })

    }
}
