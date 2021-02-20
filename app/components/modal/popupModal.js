import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {Modal} from 'antd-mobile';
import 'antd/es/avatar/style';
import 'antd/es/select/style';

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

class PopupModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({visible: nextProps.visible});
    }

    render() {
        const {visible} = this.state;
        const {closable, maskClosable,onClose, className,wrapClassName,children, transparent} = this.props;
        return (
            <Modal
                popup
                visible={visible}
                onClose={onClose}
                closable={closable}
                maskClosable={maskClosable}
                showMask={false}
                animationType="slide-up"
                className={classnames("popupModal",className)}
                wrapClassName={classnames(wrapClassName)}
            >
                {children}
            </Modal>
        );
    }
}

PopupModal.defaultProps = {
    visible: false,
    closable: false,
    transparent: false,
    maskClosable: true,
};
PopupModal.propTypes = {
    closable: PropTypes.bool,
    maskClosable: PropTypes.bool,
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};
export default connect(null, null)(withRouter(PopupModal))