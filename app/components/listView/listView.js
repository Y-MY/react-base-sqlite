import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import {PullToRefresh, ListView, Button, Icon} from 'antd-mobile';
import {Skeleton} from 'antd';
import "antd/es/skeleton/style";

const skeletonCount = 10;//预显示骨架数
class ListViewComp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //document.documentElement.clientHeight
            height: document.documentElement.clientHeight,
            useBodyScroll: props.useBodyScroll,
        };
    }

    componentDidMount() {
        /*   let _height = ReactDOM.findDOMNode(this.lv) ?
               ReactDOM.findDOMNode(this.lv).parentNode?
                   ReactDOM.findDOMNode(this.lv).parentNode.offsetHeight
                   : document.documentElement.clientHeight
               :document.documentElement.clientHeight;
           console.log('1111',_height);*/
        // this.setState({height:_height})

    }

    componentDidUpdate() {
        // console.log(this.state.useBodyScroll)
        if (this.state.useBodyScroll) {
            document.body.style.overflow = 'auto';
        } else {
            document.body.style.overflow = 'hidden';
        }
    }

    render() {
        const {row, dataSource, refreshing, isLoading, SkeletonLoading} = this.props;
        const skeletonData = Array(skeletonCount).fill(< Skeleton active/>);
        return (
            <div style={{height: '100%'}} className={"custom-list-view"}>
                {
                    !SkeletonLoading ?
                        <ListView
                            key={this.state.useBodyScroll ? '0' : '1'}
                            ref={el => this.lv = el}
                            dataSource={dataSource}
                            renderFooter={() => (<div style={{padding: 5, textAlign: 'center'}}>
                                {isLoading ? <Icon type={'loading'}/> : '数据已经加载完啦~'}
                            </div>)}
                            activeStyle={{background: '#eeeeee'}}
                            renderRow={row}
                            useBodyScroll={this.state.useBodyScroll}
                            style={this.state.useBodyScroll ? {} : {
                                height: '100%',
                            }}
                            pullToRefresh={<PullToRefresh
                                refreshing={refreshing}
                                damping={25}
                                onRefresh={(event) => {
                                    this.props.onRefresh(event)
                                }}
                            />}
                            onEndReached={(event) => {
                                this.props.onEndReached(event)
                            }}
                            onEndReachedThreshold={50}
                            pageSize={5}
                            initialListSize={100}
                        />
                        : <div style={{backgroundColor: "#fff"}}>{skeletonData}</div>
                }</div>
        );
    }
}

ListViewComp.defaultProps = {
    useBodyScroll: false
};
ListViewComp.propTypes = {
    row: PropTypes.func,
    useBodyScroll: PropTypes.bool,
    refreshing: PropTypes.bool,
    isLoading: PropTypes.bool,
    hasMore: PropTypes.bool,
    SkeletonLoading: PropTypes.bool,
    dataSource: PropTypes.object,
    onRefresh: PropTypes.func,
    onEndReached: PropTypes.func
};

export default withRouter(ListViewComp);
