import React, { Component } from 'react';
import './style/index.less';
class index extends Component {
    render() {
        return (
            <div style={{...this.props.style}} className="nodata">
                <img src={require('../../../assets/images/nodata.png')}/>
                <div style={{
                    fontSize:"16px",
                    textAlign:"center",
                    color:"#a3a6a8"
                }}>暂无相关,请您联系管理员~</div>
            </div>
        );
    }
}

export default index;