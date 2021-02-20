import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import Topbar from "../../components/topbar/topbar";
import './style/index.less';

class Developing extends Component {
    state = {
    };

    goBack = () => {
        this.props.history.goBack();
    };

    render() {
        return (
            <div className="developing">
                <Topbar title={this.props.title.replace("\<br\>", "")} onClick={() => this.goBack()}/>
                <div className="developing-entry">
                    <img src={require('../../../assets/images/nodata.png')}/>
                    <div style={{
                        fontSize:".2rem",
                        textAlign:"center",
                        color:"#a3a6a8"
                    }}>开发中</div>
                </div>
            </div>
        );
    }
}


const DevelopingComp = withRouter(Developing);
export default connect(null, null)(DevelopingComp);