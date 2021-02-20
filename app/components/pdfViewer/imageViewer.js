import React, {Component} from 'react';
import WxImageViewer from 'react-wx-images-viewer';
import {Slider} from 'antd-mobile';
import PropTypes from 'prop-types';
import './style/index.less';


const prefix = "imageView";

class ImageView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: props.currentPage,//从0开始,,
        }
    }


    componentWillMount() {
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (this.props.currentPage !== nextProps.currentPage) {
            this.setState({currentPage: nextProps.currentPage})
        }
    }

    componentDidMount() {
        document.addEventListener('touchend', this.changeIndex)
    }

    componentWillUnmount() {
        document.removeEventListener('touchend', this.changeIndex);
    }

    changeIndex = (e) => {
        // console.log(e.target.getAttribute("class"));
        if (e.target.getAttribute("class") !== null
            && e.target.getAttribute("class").includes("am-slider")) {
            return;
        }
        let currentPage = 0;
        let pointer = document.getElementsByClassName('viewer-image-pointer')[0];
        let pointerChild = pointer.getElementsByTagName('span');
        for (let index = 0; index < pointerChild.length; index++) {
            if (pointerChild[index].getAttribute("class").includes('on')) {
                currentPage = index;
                break;
            }
        }
        this.setState({
            currentPage: currentPage,
        });
    };

    handleSliderChange = (value) => {
        let currentPage = value - 1;

        let pointer = document.getElementsByClassName('viewer-image-pointer')[0];
        let pointerChild = pointer.getElementsByTagName('span');
        //往左滑
        if (this.state.currentPage > currentPage) {
            pointerChild[currentPage + 1].classList.remove('on');
            pointerChild[currentPage].classList.add('on');
        } else {//往右滑
            pointerChild[currentPage - 1].classList.remove('on');
            pointerChild[currentPage].classList.add('on');
            this.handleImageList();
        }

        let viewerList = document.getElementsByClassName('viewer-list-container')[0];
        let viewerListChild = viewerList.getElementsByTagName('div');
        let left = viewerListChild[currentPage].style.left;
        left = "-" + left;
        viewerList.style = "transform: translate3d(" + left + ", 0px, 0px)";

        this.setState({
            currentPage: currentPage,
        });

    };

    handleImageList = () => {

    };


    render() {
        const {currentPage} = this.state;
        const {imageList} = this.props;
        let sliderValue = currentPage + 1;

        return (
            <div className={prefix}>
                {imageList.length ?
                    <div>
                        <WxImageViewer
                            urls={imageList}
                            index={currentPage}
                            zIndex={1}
                            onClose={()=>{console.log('11111')}}
                            ref="imgaeView"
                        />
                        <div className={prefix + "-page"}>
                            <span>{`${sliderValue}/${imageList.length}`}</span>
                        </div>
                        <Slider
                            value={sliderValue}
                            min={1}
                            max={imageList.length}
                            onChange={this.handleSliderChange}
                            trackStyle={{
                                backgroundColor: '#fff',
                                height: '5px',
                            }}
                            railStyle={{
                                backgroundColor: '#333',
                                height: '5px',
                            }}
                            handleStyle={{
                                borderColor: '#fff',
                                height: '14px',
                                width: '14px',
                                marginLeft: '-7px',
                                marginTop: '-4.5px',
                                backgroundColor: '#fff',
                            }}
                        />
                    </div> : ""
                }
            </div>

        )
    }
}

ImageView.defaultProps = {
    currentPage: 0,
};
ImageView.propTypes = {
    imageList: PropTypes.array.isRequired,
    currentPage: PropTypes.number.isRequired,
};
export default ImageView;