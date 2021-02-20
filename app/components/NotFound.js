import React, {Component} from 'react';
import {withRouter, Link} from 'react-router-dom';
import {Empty} from 'antd';
import "antd/es/empty/style";

class NotFound extends Component {
    render() {
        return (
            <div style={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
            >
                <Empty
                    style={{color: "#888", fontSize: ".17rem"}}
                    description={
                        <span>未找到相应的页面
                             <br/>程序猿小哥正在努力赶工中...
                             <br/>若为旧版本，请更新最新版本。
                             <br/>返回请点击此处<Link to="/home">首页</Link>
                        </span>
                    }
                />
            </div>
        );
    }
}

export default withRouter(NotFound);