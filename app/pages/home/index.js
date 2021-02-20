import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Button} from 'antd-mobile';
import Topbar from '../../components/topbar/topbar';
import 'antd/es/input/style';
import 'antd/es/icon/style';
import 'antd/es/col/style';

import './style/index.less';

const prefix = "my_home";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {

        return (
            <div className={prefix}>
                <Topbar title="首页" onClick={() => this.props.history.goBack()}/>
                <div className={prefix + "-box"}>
                    <Button>数据库</Button>
                </div>
            </div>
        );
    }
}

export default connect(null, null)(withRouter(Home));
