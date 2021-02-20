import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Badge, Flex, Toast} from 'antd-mobile';
import {withRouter} from 'react-router-dom';
import axios from 'axios';
import './style/index.less';
import {footbarData} from './data';

import noAuth from '../../util/noAuth';
import commonUrl from '../../config';
import Icon from '../icon';

import PropTypes from 'prop-types';

let lastClickMessage = undefined;
let lastReceiveMessage = undefined;

class footerbar extends Component {
    state = {
        unReadedMsgNum: 0,
        testMes: '',
    };

    componentWillMount() {
        if(!this.props.noMessage){
            this.getUnreadedMsgNum();
        }
    }

    componentDidMount() {
        const _that = this;
        const {module, queryMsgList} = this.props;
        try {
            //  if (window.plus) {
            document.addEventListener("plusready", function () {
                plus.push.addEventListener("click", function (msg) {
                    console.log('====================click====================');
                    //console.log('msg1:', JSON.stringify(msg));
                    let payload = msg.payload;
                    try {
                        //本地创建消息时，将payload专程json字符串，此处需解码
                        payload = JSON.parse(msg.payload);
                        console.log("payload1", JSON.stringify(payload));
                    } catch (err) {
                        payload = msg.payload;
                        console.log("payload2", JSON.stringify(payload));
                    }
                    if (payload.hasOwnProperty('info')) {
                        payload = JSON.parse(payload.info);
                    }
                    //console.log('payload',JSON.stringify(payload))
                    _that.handleMessageJump(payload);
                }, false);
                plus.push.addEventListener("receive", function (msg) {
                    console.log('====================receive====================');
                    //console.log('msg:', JSON.stringify(msg));
                    _that.getUnreadedMsgNum();
                    if (module && module === 'message' && queryMsgList) {
                        queryMsgList();
                    }
                    let payload = msg.payload;
                    try {
                        //本地创建消息时，将payload专程json字符串，此处需解码
                        payload = JSON.parse(msg.payload);
                        //console.log("payload11", JSON.stringify(payload));
                    } catch (err) {
                        payload = msg.payload;
                        //console.log("payload22", JSON.stringify(payload));
                    }
                    if (!msg.aps) { // 应用在线
                        if (!payload.hasOwnProperty('way') || payload.way !== "LocalMsg") {//这条消息不是本地创建，需本地创建消息
                            /* console.log('infinite');*/
                            payload.way = "LocalMsg";
                            let msgBody = undefined;
                            let content = undefined;
                            try {
                                content = JSON.parse(msg.content);
                                msgBody = content.msgBody;
                            } catch (err) {
                                msgBody = msg.content;
                            }
                            if (content && lastReceiveMessage !== content.id) {
                                /* console.log('hahaha');*/
                                lastReceiveMessage = content.id;
                                let messageOption = {cover: false, delay: 1};
                                plus.push.createMessage(msgBody, JSON.stringify(payload), messageOption);
                            }
                        }
                    } else {//应用离线，消息从apns服务器发送,点击离线消息，进入app，触发receive事件
                        if (window.deviceType === 'iOS') {
                            if (payload.hasOwnProperty('info')) {
                                payload = JSON.parse(payload.info);
                            }
                            _that.handleMessageJump(payload);
                        }
                    }
                }, false);
            })

            //  }
        } catch (plusError) {
            console.log('该浏览器不支持plus')
        }
    }

    handleMessageJump = (payload) => {
        let payloadTypeOf = typeof payload,
            params = undefined,
            msgType = undefined,
            messageId = undefined;
        const {history} = this.props;
        if (payloadTypeOf === 'object') {
            msgType = payload.type;
            params = decodeURIComponent(payload.params);
            params = (new Function("return " + params))();
            messageId = params.id;
        } else {//android 离线
            payload = eval("(" + payload + ")");
            params = payload.params;
            messageId = params.id;
            msgType = parseInt(payload.type);
        }
        if (msgType === 8) {//服务订单
            lastClickMessage = undefined;
        }
        if (!lastClickMessage || lastClickMessage !== messageId) {
            lastClickMessage = messageId;
            if (msgType === 2) {
                history.push({pathname: `/messageNotice/${messageId}/${msgType}`});
            } else if (msgType === 4) {
                history.push({pathname: `/zbdetail/${messageId}`});
            } else if (msgType === 8) {//服务订单
                this.readMsg(payload.id, msgType);
                history.push({pathname: `/orderDetail/${messageId}`})
            } else {
                Toast.info("请到电脑上查看消息详情！");
            }
        }
    };

    readMsg = (id, type) => {
        const {userinfo} = this.props;
        axios.post(`${commonUrl}/app/readMsgRecord.do`, {userId: userinfo.id, recordId: id, type: type})
            .then(res => {
                noAuth(res.data, () => this.props.history.push('/login'));
                if (res.data.code === 'success') {
                }
            })
    };

    getUnreadedMsgNum = () => {
        const {userinfo, history} = this.props;
        axios.post(`${commonUrl}/app/msg/qryUnreadedMsgNum.do`, {userId: userinfo.id})
            .then(res => {
                noAuth(res.data, () => history.push('/login'));
                if (res.data.code === 'success') {
                    this.setState({unReadedMsgNum: res.data.data})
                }
            })
    };

    gowhere = (key) => {
        key = `/${key}`;
        this.props.history.push(key);

    };

    clickItem = (path) => {
        localStorage.getItem('username') ? this.gowhere(path) : this.gowhere('login')
    };

    render() {
        const {location, data} = this.props;
        const {unReadedMsgNum} = this.state;
        const path = location.pathname.split('/')[1];
        const initPath = 'home';
        // const initPath = data[0].path;
        // console.log(initPath);
        return (
            <div className="footerbar">
                <Flex>
                    {
                        data.length && data.map((item, index) => (
                                item.path === 'message' ?
                                    <Flex.Item onClick={() => this.clickItem(item.path)} key={`footerbar${item.path}`}>
                                        <div className={path === item.path ? "active" : ""}>
                                            <Badge overflowCount={99} text={unReadedMsgNum} style={{marginTop: '5px'}}>
                                                <Icon
                                                    className="footer_icon"
                                                    style={{color: "#b6b6b6", fontSize: ".28rem"}}
                                                    type={item.icon} theme="filled"/>
                                            </Badge>
                                            <div className="footer_title">{item.name}</div>
                                        </div>
                                    </Flex.Item> :
                                    <Flex.Item onClick={() => this.clickItem(item.path)} key={`footerbar${item.path}`}>
                                        <div
                                            className={path === item.path ? "active" : "" || (path === "" && item.path === initPath ? "active" : "")}>
                                            <Icon
                                                className="footer_icon"
                                                style={{color: "#b6b6b6", fontSize: ".28rem"}}
                                                type={item.icon} theme="filled"/>
                                            <div className="footer_title">{item.name}</div>
                                        </div>
                                    </Flex.Item>
                            )
                        )
                    }
                </Flex>
            </div>
        );
    }
}

const mapStateToProps = (state, ownprops) => {
    return {
    }
};

footerbar.defaultProps = {
    module: undefined,
    queryMsgList: undefined,
    data: footbarData,
    noMessage:false

};
footerbar.propTypes = {
    module: PropTypes.string,/*该底部条被哪个模块引用*/
    queryMsgList: PropTypes.func,//当处于消息中心，刷新消息列表
    data: PropTypes.array.isRequired,
    noMessage:PropTypes.bool
};

export default connect(null, null)(withRouter(footerbar));