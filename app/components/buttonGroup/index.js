import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import classnames from "classnames";
import PropTypes from "prop-types";
import "./style/index.less";

const prefix = "buttonGroup";

class ButtonGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentMenu: undefined,
            menuData: [],
        }
    }

    componentWillMount() {
        const {data} = this.props;
        this.setState({menuData: data});
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)) {
            let menuData = nextProps.data;
            this.setState({menuData: menuData, currentMenu: menuData[0]});
        }
    }


    menuChange = (menu) => {
        const {onChange} = this.props;
        this.setState({currentMenu: menu}, () => {
            onChange(menu)
        });
    };

    render() {
        const {menuData, currentMenu} = this.state;
        console.log(currentMenu, menuData[0])
        let current = currentMenu ? currentMenu : menuData[0];
        return (
            <div className={prefix + "-container"}>
                {menuData.length ? menuData.map((item, index) => (
                        <span
                            key={`infoMenu${index}`}
                            onClick={() => this.menuChange(item)}
                            className={classnames(prefix + "-menu", item.key === current.key ? "active" : "")}
                        >
                                {item.title}
                            </span>
                    )
                ) : ""}
            </div>
        );
    }
}

ButtonGroup.defaultProps = {
    data: [],

};
ButtonGroup.propTypes = {
    data: PropTypes.array.isRequired,
    currentMenu: PropTypes.object,
    onChange: PropTypes.func.isRequired
};

export default withRouter(ButtonGroup);
