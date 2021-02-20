import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {NavBar} from "antd-mobile";
import {Icon} from "antd";
import 'antd/es/icon/style';
import './style/index.less';


const prefix = "smallProgram";

class Topbar extends React.Component {

    render() {
        const {onClick, title, rightContent} = this.props;
        return (
            <div className={"small-program"}>
                {/* <div className={prefix + "-content"}>{title}</div>
                <div className={prefix + "-right"}>
                    <span>
                         <Icon onClick={onClick} type="close"/>
                    </span>

                </div>*/}
                <NavBar
                    mode="light"
                    rightContent={
                        <div className={"right"} onClick={onClick}>
                            <span>
                                 <Icon type="close"/>
                            </span>
                        </div>
                    }
                >{title}</NavBar>
            </div>

        )
    }
}

export default withRouter(Topbar);

