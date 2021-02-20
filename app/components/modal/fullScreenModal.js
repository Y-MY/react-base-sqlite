import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Modal} from 'antd-mobile';
import {withRouter} from 'react-router-dom';
import Proptypes from 'prop-types';
import './style/index.less';

function closest(el, selector) {
    const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
    while (el) {
        if (matchesSelector.call(el, selector)) {
            return el;
        }
        el = el.parentElement;
    }
    return null;
}

class FullScreenModal extends React.Component {
    state = {
        visible: false
    };

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({visible: nextProps.visible});
    }


    onWrapTouchStart = (e) => {
        if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
            return;
        }
        const pNode = closest(e.target, '.am-modal-content');
        if (!pNode) {
            e.preventDefault();
        }
    };

    render() {
        const {visible} = this.state;
        const {onClose,children} = this.props;
        return (
            <Modal
                className="fullScreenModal"
                visible={visible}
                transparent
                maskClosable={false}
                onClose={onClose}
                title={null}
                footer={[]}
                wrapProps={{onTouchStart: this.onWrapTouchStart}}
            >
                <div style={{height: '100%', overflow: 'hidden'}}>
                    {children}
                </div>
            </Modal>
        );
    }
}

FullScreenModal.defultProps = {
    visible: false
};

FullScreenModal.propTypes = {
    visible: Proptypes.bool,
    onClose: Proptypes.func
};

export default connect(null, null)(withRouter(FullScreenModal))
