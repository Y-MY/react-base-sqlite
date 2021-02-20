import React from 'react';
import * as PDFJS from "pdfjs-dist";
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import raf from 'raf';
import tween from './utils/tween';
import {ActivityIndicator, Slider, Toast} from "antd-mobile";
import PopupModal from "../modal/popupModal";
import Icon from "../icon";
import "./style/index.less"

PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;
const screenWidth = typeof document !== 'undefined' && document.documentElement.clientWidth;
const screenHeight = typeof document !== 'undefined' && document.documentElement.clientHeight;
const maxAnimateTime = 1000;
const minTapMoveValue = 5;
const maxTapTimeValue = 300;
const minTapTimeValue = 200;
const startPage = 1;
const maxZoomNum = 4;
const gap = 0;
// 快速拖动时间限制
const DEFAULT_TIME_DIFF = 200;
const speed = 300;
const definition = 1;

function setScope(value, min, max) {
    if (value < min) {
        return min;
    }
    if (value > max) {
        return max;
    }
    return value;
}


function getDistanceBetweenTouches(e) {
    if (e.touches.length < 2) return 1;
    const x1 = e.touches[0].clientX;
    const y1 = e.touches[0].clientY;
    const x2 = e.touches[1].clientX;
    const y2 = e.touches[1].clientY;
    //Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
    return Math.sqrt(((x2 - x1) ** 2) + ((y2 - y1) ** 2));
}

class PDFImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pdf: '',
            popupModal: false,
            currentPage: props.currentPage,//当前页数
            // currentPage: ,//当前页数
            transformLeft: 0,//位移偏移量
            downloaded: false,
            loadingText: '文件下载中...',

            scale: 1,
            left: 0,
            top: 0,

            width: 0,
            height: 0,
            isLoaded: false,
        };

        this.fontSize = (document.documentElement.clientWidth / 414) * 100;
        this.firstRender = true;
        this.totalPages = 0;
        this.renderPrevFlag = 0;
        this.renderPages = {prev: [], next: []};
        this.renderNextFlag = 0;
        this.pdfIsLoaded = false;
        this.handleStartLeft = 0;

        this.actualHeight = 0; // 图片实际高度
        this.actualWith = 0; // 图片实际宽度

        this.originHeight = 0; // 图片默认展示模式下高度
        this.originWidth = 0; // 图片默认展示模式下宽度
        this.originScale = 1; // 图片初始缩放比例

        this.startLeft = 0; // 开始触摸操作时的 left 值
        this.startTop = 0; // 开始触摸操作时的 top 值
        this.startScale = 1; // 开始缩放操作时的 scale 值

        this.onTouchStartTime = 0; // 单指触摸开始时间

        this.isTwoFingerMode = false; // 是否为双指模式
        this.oldPointLeft = 0;// 计算手指中间点在图片上的位置（坐标值）
        this.oldPointTop = 0;// 计算手指中间点在图片上的位置（坐标值）
        this._touchZoomDistanceStart = 0; // 用于记录双指距离
        this.haveCallMoveFn = false;

        this.diffX = 0;// 记录最后 move 事件 移动距离
        this.diffY = 0;// 记录最后 move 事件 移动距离

        this.animationID = 0;
        this.animateStartTime = 0;
        this.animateStartValue = {
            x: 0,
            y: 0,
        };
        this.animateFinalValue = {
            x: 0,
            y: 0,
        };

        this.startX = 0;
        this.startY = 0;
    }


    componentWillMount() {
        const {src, fileName} = this.props;
        this.getPDF(src, fileName);


    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (this.props.currentPage !== nextProps.currentPage || this.props.src !== nextProps.src) {
            this.setState({currentPage: nextProps.currentPage}, () => {
                this.getPDF(nextProps.src, nextProps.fileName);
            })
        }
    }

    componentWillUnmount() {
        if (this.animationID) {
            raf.cancel(this.animationID);
        }
    }

    getPDF = (src, fileName) => {
        const _this = this;
        let attachmentUrl = src;
        let attachmentName = fileName;
        let attachmentId = attachmentUrl.substr(attachmentUrl.lastIndexOf("=") + 1);
        let attachmentNamePreffix = attachmentName.substr(0, attachmentName.lastIndexOf("."));
        let attachmentNameSuffix = attachmentName.substr(attachmentName.lastIndexOf(".") + 1);

        let filename = `${attachmentNamePreffix}_${attachmentId}.${attachmentNameSuffix}`;
        let filepath = attachmentUrl;

        try {
            plus.io.resolveLocalFileSystemURL(  //判断文件是否已经下载
                '_downloads/' + filename,
                function (entry) {//如果已存在文件，则打开文件
                    if (entry.isFile) {
                        _this.setState({downloaded: true});
                        entry.file(function (file) {
                            var fileReader = new plus.io.FileReader();
                            fileReader.readAsDataURL(file);
                            fileReader.onloadend = function (evt) {
                                let fileResult = _this.convertDataURIToBinary(evt.target.result);
                                _this.renderPDF(fileResult);
                            };
                        });
                    }
                }, function () {//如果未下载文件，则下载后打开文件
                    var dtask = plus.downloader.createDownload(filepath, {filename: '_downloads/' + filename}, function (d, status) {
                        if (status === 200) {
                            _this.setState({downloaded: true});
                            plus.io.resolveLocalFileSystemURL('_downloads/' + filename, function (entry) {//如果已存在文件，则打开文件
                                if (entry.isFile) {
                                    // plus.runtime.openFile('_downloads/' + filename);
                                    entry.file(function (file) {
                                        var fileReader = new plus.io.FileReader();
                                        fileReader.readAsDataURL(file);
                                        fileReader.onloadend = function (evt) {
                                            let fileResult = _this.convertDataURIToBinary(evt.target.result);
                                            _this.renderPDF(fileResult);
                                        };
                                    });
                                }
                            })
                        } else {
                            Toast.error("下载失败: " + status);
                        }
                    });
                    dtask.addEventListener("statechanged", function (task, status) {
                        if (!dtask) {
                            return;
                        }
                        switch (task.state) {
                            case 1:
                                //Toast.success("开始下载...", 1);
                                break;
                            case 2:
                                // Toast.success("正在下载...", 1);
                                break;
                            case 4:
                                dtask = null;
                                break;
                        }
                    });
                    dtask.start();
                }
            );
        } catch (plusError) {
            _this.setState({downloaded: true});
            this.renderPDF(src);
        }

    };


    convertDataURIToBinary = (dataURI) => {
        let BASE64_MARKER = ';base64,';
        var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
        var base64 = dataURI.substring(base64Index);
        var raw = window.atob(base64);
        var rawLength = raw.length;
        var array = new Uint8Array(new ArrayBuffer(rawLength));
        for (var i = 0; i < rawLength; i++) {
            array[i] = raw.charCodeAt(i);
        }
        return array;
    };


    renderPDF = (src) => {
        const {currentPage} = this.state;
        const self = this;
        const loadingTask = PDFJS.getDocument(src);
        loadingTask.promise.then(function (pdf) {
            if (pdf) {
                // pdf 总页数
                let pageNums = pdf.numPages;
                self.init(pdf, pageNums);
                self.pdfCreator(currentPage);
            }
        }).catch(function (reason) {
            console.error("Error: " + reason);
        });

    };

    pdfCreator = (pageNumber) => {
        const self = this;
        let canvas = document.getElementById("pageNum" + pageNumber);
        if (!canvas) {
            const container = document.createElement('div');
            container.className = "pdf-canvas-container";
            container.id = "pdfContainer" + pageNumber;
            container.style.position = 'absolute';
            container.style.left = `${(pageNumber - 1) * screenWidth}px`;
            container.style.width = `${screenWidth}px`;
            const canvas = document.createElement('canvas');
            canvas.id = "pageNum" + pageNumber;
            container.append(canvas);
            $('#pdf-container').append(container);
        }
        self.openPDFPage(pageNumber);
    };


    openPDFPage = (pageNumber) => {
        let {scale} = this.state;
        let self = this;
        try {
            this.pdfDoc.getPage(pageNumber).then(function (page) {
                let canvas = document.getElementById("pageNum" + pageNumber);
                let ctx = canvas.getContext("2d");
                let dpr = window.devicePixelRatio || 1;
                let bsr =
                    ctx.webkitBackingStorePixelRatio ||
                    ctx.mozBackingStorePixelRatio ||
                    ctx.msBackingStorePixelRatio ||
                    ctx.oBackingStorePixelRatio ||
                    ctx.backingStorePixelRatio ||
                    1;
                let ratio = dpr / bsr;
                let scalNum = definition || 1;
                let viewport = page.getViewport(screen.availWidth / page.getViewport(1).width);
                if (self.firstRender) {
                    self.firstRender = false;
                    self.onLoad(viewport);
                }
                canvas.width = viewport.width * ratio * scalNum;
                canvas.height = viewport.height * ratio * scalNum;
                canvas.style.width = viewport.width * scalNum + "px";
                canvas.style.height = viewport.height * scalNum + "px";
                ctx.setTransform(ratio * scalNum, 0, 0, ratio * scalNum, 0, 0);
                let renderContext = {
                    //这里transform比较关键 保证根据手势缩放后的清晰度和等比例
                    // transform: [ratio * scalNum, 0, 0, ratio * scalNum, 0, 0],
                    // transform:`scale(${ratio * scalNum}, ${ratio * scalNum})`,
                    canvasContext: ctx,
                    viewport: viewport
                };

                page.render(renderContext).promise.then(() => {
                    self.exportImg(pageNumber);
                    if (!self.pdfIsLoaded) {
                        if (self.renderPrevFlag === 0 && self.renderNextFlag === 0) {
                            if (pageNumber === 1) {
                                self.renderNext(pageNumber);
                            } else if (pageNumber === self.totalPages) {
                                self.renderPrev(pageNumber);
                            } else if (pageNumber > 1 && pageNumber < self.totalPages) {
                                self.renderPrevFlag = pageNumber;
                                self.renderNextFlag = pageNumber;
                                self.renderPrev(self.renderPrevFlag);
                                self.renderNext(self.renderNextFlag);
                            }
                        } else if (self.renderPrevFlag !== 0 && self.renderNextFlag === 0) {
                            if (self.renderPrevFlag !== 1) {
                                self.renderPrev(pageNumber);
                            } else {
                                self.pdfIsLoaded = true;
                            }

                        } else if (self.renderPrevFlag === 0 && self.renderNextFlag !== 0) {
                            if (self.renderNextFlag !== self.totalPages) {
                                self.renderNext(pageNumber);
                            } else {
                                self.pdfIsLoaded = true;
                            }
                        } else if (self.renderPrevFlag !== 0 && self.renderNextFlag !== 0) {
                            if (self.renderPrevFlag !== 1 && self.renderNextFlag !== self.totalPages) {
                                self.renderNext(self.renderNextFlag);
                                self.renderPrev(self.renderPrevFlag);
                            } else if (self.renderPrevFlag === 1 && self.renderNextFlag !== self.totalPages) {
                                self.renderNext(self.renderNextFlag);
                            } else if (self.renderPrevFlag !== 1 && self.renderNextFlag === self.totalPages) {
                                self.renderPrev(self.renderPrevFlag);
                            } else {
                                self.pdfIsLoaded = true;
                            }
                        }
                    }
                });
            });
        } catch (e) {
            console.log(e)
        }
    };

    renderPrev = (pageNumber) => {
        this.renderPrevFlag = pageNumber - 1;

        let prev = this.renderPages.prev;
        prev.push(this.renderPrevFlag);
        this.renderPages.prev = prev;

        this.pdfCreator(this.renderPrevFlag);
    };

    renderNext = (pageNumber) => {
        this.renderNextFlag = pageNumber + 1;
        let next = this.renderPages.next;
        next.push(this.renderNextFlag);
        this.renderPages.next = next;

        this.pdfCreator(this.renderNextFlag)
    };

    exportImg = (pageNumber) => {
        var canvas = document.getElementById("pageNum" + pageNumber);
        // 将 canvas 转成 base64 格式的图片
        let base64ImgSrc = canvas.toDataURL("image/png");
        const img = document.createElement("img");
        img.setAttribute('class', 'pdf-img');
        img.src = base64ImgSrc;
        img.style.width = '100%';
        img.style.position = 'absolute';
        // 将图片挂载到 dom 中
        document.getElementById('pdf-container').append(img);
    };


    onLoad = (viewport) => {
        this.actualWith = viewport.width;
        this.actualHeight = viewport.height;

        const left = 0;
        let top = 0;

        this.originWidth = screenWidth;
        this.originHeight = (this.actualHeight / this.actualWith) * screenWidth;
        this.originScale = 1;

        let topBarHeight = this.fontSize * 0.5;
        this.topBarHeight = topBarHeight;
        if (this.actualHeight / this.actualWith < screenHeight / screenWidth) {
            top = parseInt((parseInt(screenHeight) - parseInt(topBarHeight) - parseInt(this.originHeight)) / 2, 10);
        }
        this.originTop = top;

        this.setState({
            width: this.originWidth,
            height: this.originHeight,
            /* scale: 1,*/
            left,
            top,
            isLoaded: true,
        });
    };

    init = (pdf, pageNums) => {
        const {currentPage} = this.state;
        this.pdfDoc = pdf;
        this.totalPages = pageNums;
        this.perDistance = screenWidth + gap;
        this.maxLeft = this.perDistance * (this.totalPages - 1);
        this.setState({
            transformLeft: -this.perDistance * (currentPage - 1),
        });
    };


    handleStart = () => {
        // console.info("ListContainer handleStart", this.state.transformLeft)
        this.handleStartLeft = this.state.transformLeft;
        this.startTime = (new Date()).getTime();
    };

    handleMove = (diffX) => {
        let nDiffx = diffX;
        // 限制最大 diffx 值
        if (Math.abs(nDiffx) > screenWidth) {
            if (nDiffx < 0) {
                nDiffx = -screenWidth;
            }
            if (nDiffx > 0) {
                nDiffx = screenWidth;
            }
        }
        if (this.state.transformLeft >= 0 && nDiffx > 0) {
            nDiffx = this.easing(nDiffx);
        } else if (this.state.transformLeft <= -this.maxLeft && nDiffx < 0) {
            nDiffx = -this.easing(-nDiffx);
        }
        let transformLeft = this.handleStartLeft + nDiffx;
        if (transformLeft >= 0 && nDiffx > 0) {
            transformLeft = 0;
        }
        //console.info(" handleMove end diffX = %s", this.state.transformLeft, this.handleStartLeft, nDiffx);
        this.setState({
            transformLeft: transformLeft,
        });
    };

    handleEnd = () => {
        //console.log('handleEnd',this.state.transformLeft,this.handleStartLeft)
        let index;
        if (this.state.transformLeft < this.handleStartLeft) {
            index = this.state.currentPage + 1;
        } else {
            index = this.state.currentPage - 1;
        }

        if (index < startPage) {
            index = startPage;
        } else if (index >= this.totalPages) {
            index = this.totalPages;
        }

        console.log('handleEnd', index, this.state.currentPage, -this.perDistance * (index - 1))
        if (index !== this.state.currentPage) {
            this.setState({
                currentPage: index,
                transformLeft: -this.perDistance * (index - 1)
            });
            return true;
        }
        if (index === this.state.currentPage && index === this.totalPages) {//边界处理
            this.setState({
                transformLeft: -this.perDistance * (index - 1)
            });
            return true;
        }
        return false;
    };

    handleTouchStart = (event) => {
        event.preventDefault();
        if (this.animationID) {
            raf.cancel(this.animationID);
        }
        switch (event.touches.length) {
            case 1: {
                const targetEvent = event.touches[0];
                this.startX = targetEvent.clientX;
                this.startY = targetEvent.clientY;
                this.diffX = 0;
                this.diffY = 0;

                this.startLeft = this.state.left;
                this.startTop = this.state.top;

                this.onTouchStartTime = (new Date()).getTime();
                this.haveCallMoveFn = false;
                break;
            }
            case 2: { // 两个手指
                // 设置手双指模式
                this.isTwoFingerMode = true;

                // 计算两个手指中间点屏幕上的坐标
                const middlePointClientLeft = Math.abs(Math.round((event.touches[0].clientX + event.touches[1].clientX) / 2));
                const middlePointClientTop = Math.abs(Math.round((event.touches[0].clientY + event.touches[1].clientY) / 2));

                // 保存图片初始位置和尺寸
                this.startLeft = this.state.left;
                this.startTop = this.state.top;
                this.startScale = this.state.scale;

                // 计算手指中间点在图片上的位置（坐标值）
                this.oldPointLeft = middlePointClientLeft - this.startLeft;
                this.oldPointTop = middlePointClientTop - this.startTop;

                this._touchZoomDistanceStart = getDistanceBetweenTouches(event);
                break;
            }
            default:
                break;
        }
    };

    handleTouchMove = (event) => {
        event.preventDefault();

        switch (event.touches.length) {
            case 1: {
                const targetEvent = event.touches[0];
                const diffX = targetEvent.clientX - this.startX;
                const diffY = targetEvent.clientY - this.startY;

                this.diffX = diffX;
                this.diffY = diffY;
                // 判断是否为点击
                /*  if (Math.abs(diffX) < minTapMoveValue && Math.abs(diffY) < minTapMoveValue) {
                    return
                  }*/
                // console.info('handleMove one clientX=%s, this.startX=%s,diffX=%s',targetEvent.clientX, this.startX,diffX);
                // console.info('handleMove one', Math.abs(diffX), Math.abs(diffY));
                /* console.info(
                     'handleMove one left=%s, this.startLeft=%s,this.originWidth=%s, width=%s,diffX=%s',
                     left, this.startLeft, this.originWidth, width,diffX
                 );*/

                const {scale} = this.state;
                const width = scale * this.originWidth;
                if (Math.abs(diffX) > Math.abs(diffY)) { // 水平移动
                    if (this.state.scale === this.originScale && Math.abs(diffX) > minTapMoveValue) {
                        // console.log('11111');
                        this.haveCallMoveFn = true;
                        this.callHandleMove(diffX);
                        return;
                    }

                    //console.info('handleMove one left=%s, this.startLeft=%s,this.originWidth=%s, width=%s', left, this.startLeft, this.originWidth, width);
                    /* if (diffX < 0 && this.startLeft <= this.originWidth - width) {
                         console.log('22222')
                         this.haveCallMoveFn = true;
                         this.callHandleMove(diffX);
                         return;
                     }

                     if (diffX > 0 && this.startLeft >= 0) {
                         console.log('33333')
                         this.haveCallMoveFn = true;
                         this.callHandleMove(diffX);
                         return;
                     }*/
                }
                let canvas = document.getElementById("pageNum" + this.state.currentPage);
                var canvasBox = canvas.getBoundingClientRect();
                let baseTop = (canvasBox.height - screenHeight + this.topBarHeight) / 2;

                let subtraction = (screenHeight - this.topBarHeight - this.actualHeight) / 2;
                let maxTop = baseTop + subtraction;
                let minTop = -(baseTop - subtraction) + 1;

                const height = scale * this.originHeight;
                let newTop = (screenHeight - this.topBarHeight - height) / 2;
                let newLeft = this.startLeft + diffX;


                if (height > screenHeight || this.state.scale !== this.originScale) {//拖拽边界判断
                    newTop = this.startTop + diffY;
                    if (newTop > maxTop) {
                        newTop = maxTop;
                    } else if (newTop < 0 && newTop < minTop) {
                        newTop = minTop;
                    }
                } else if (this.state.scale === this.originScale) {
                    newTop = this.originTop;
                }

                const leftTrans = Math.abs((this.actualWith * scale - screenWidth) / 2);
                if (Math.abs(newLeft) > leftTrans) {
                    newLeft = newLeft > 0 ? leftTrans : -leftTrans;
                }
                this.setState({
                    left: newLeft,
                    top: newTop,
                });
                break;
            }
            case 2: { // 两个手指
                this._touchZoomDistanceEnd = getDistanceBetweenTouches(event);

                const zoom = Math.sqrt(this._touchZoomDistanceEnd / this._touchZoomDistanceStart);
                let scale = setScope(zoom * this.startScale, 1, maxZoomNum);
                this.setState(() => {
                    const left = this.startLeft + ((1 - zoom) * this.oldPointLeft);
                    const top = this.startTop + ((1 - zoom) * this.oldPointTop);
                    // console.info('zoom = %s, left = %s, top = %s, scale', zoom, left, top, scale);
                    return {
                        scale,
                        left,
                        top
                    };
                });
                break;
            }
            default:
                break;
        }
    };

    handleTouchEnd = (event) => {
        //console.info('handleTouchEnd', event.touches.length);
        event.preventDefault();

        if (this.isTwoFingerMode) { // 双指操作结束

            const touchLen = event.touches.length;
            this.isTwoFingerMode = false;

            if (touchLen === 1) {
                const targetEvent = event.touches[0];
                this.startX = targetEvent.clientX;
                this.startY = targetEvent.clientY;
                this.diffX = 0;
                this.diffY = 0;
            }

            console.log('handleTouchEnd originWidth=%s', this.originWidth);

            this.setState((prevState, props) => {
                const scale = setScope(prevState.scale, 1, maxZoomNum);
                const width = scale * this.originWidth;
                const height = scale * this.originHeight;
                const zoom = scale / this.startScale;
                const left = setScope(this.startLeft + ((1 - zoom) * this.oldPointLeft), this.originWidth - width, 0);

                let top;
                if (height > screenHeight) {
                    top = setScope(this.startTop + ((1 - zoom) * this.oldPointTop), screenHeight - this.topBarHeight - height, 0);
                } else {
                    top = (screenHeight - height) / 2;
                }

                if (touchLen === 1) {
                    this.startLeft = left;
                    this.startTop = top;
                    this.startScale = scale;
                    console.info('this.startX = %s, this.startY = %s, this.startLeft = %s, this.startTop = %s', this.startX, this.startY, this.startLeft, this.startTop);
                }

                console.info('zoom = %s, left = %s, top = %s, width=%s, height= %s', zoom, left, top, width, height);
                return {
                    left,
                    top,
                    scale,
                };
            }, () => {
                //this.openPage(this.state.currentPage)
            });
        } else { // 单指结束（ontouchend）
            const diffTime = (new Date()).getTime() - this.onTouchStartTime;
            const {diffX, diffY} = this;

            // console.info('handleTouchEnd one diffTime = %s, diffX = %s, diffy = %s', diffTime, diffX, diffY);
            // 判断为点击则关闭图片浏览组件
            if (diffTime < maxTapTimeValue && Math.abs(diffX) < minTapMoveValue && Math.abs(diffY) < minTapMoveValue) {
                //this.context.onClose();
                this.openPopupModal();
               // console.log('shuangji')
            }/*else if (diffTime < maxTapTimeValue && Math.abs(diffX) < minTapMoveValue && Math.abs(diffY) < minTapMoveValue){
                console.log('danji')
            }*/

            //console.info('handleTouchEnd ONE ');
            // 水平移动
            if (this.haveCallMoveFn) {
                // console.log(1111)
                //console.log('handleTouchEnd haveCallMoveFn', this.originScale, this.originTop)
                const isChangeImage = this.callHandleEnd(diffY < 30);
                if (isChangeImage) { // 如果切换图片则重置当前图片状态
                    setTimeout(() => {
                        this.setState({
                            /* scale: this.originScale,*/
                            left: 0,
                            top: this.originTop,
                        }, () => {
                            //this.openPage(this.state.currentPage)
                        });
                    }, maxAnimateTime / 3);
                    return;
                }
            } else {
                //console.log(2222, this.originTop)
                if (this.state.scale === this.originScale) {
                    this.setState({
                        top: this.originTop,
                    }, () => {
                        //this.openPage(this.state.currentPage)
                    });
                }

            }
            // TODO 下拉移动距离超过屏幕高度的 1/3 则关闭
            // console.info(Math.abs(diffY) > (this.props.screenHeight / 2), this.startTop, this.originTop);
            // if (Math.abs(diffX) < Math.abs(diffY) && Math.abs(diffY) > (this.props.screenHeight / 3) && this.startTop === this.originTop) {
            //   this.context.onClose();
            //   return;
            // }

            /*  let x;
              let y;
              const {scale} = this.state;
              // const width = scale * this.originWidth;
              const height = scale * this.originHeight;

              // 使用相同速度算法
              x = ((diffX * maxAnimateTime) / diffTime) + this.startLeft;
              y = ((diffY * maxAnimateTime) / diffTime) + this.startTop;
              if (this.state.scale === this.originScale) {
                  x = 0;
                  if (height > screenHeight) {
                      y = setScope(y, screenHeight - height, 0);
                  } else {
                      y = this.originTop;
                  }
              }
              console.log('handleTouchEnd1 scale=%s,height=%s,x=%s,y=%s', scale, height, x, y);
              console.log('handleTouchEnd2 this.state.left=%s,this.state.top=%s', this.state.left, this.state.top);

              // x = setScope(x, this.originWidth - width, 0);

              // if (height > screenHeight) {
              // y = setScope(y, screenHeight - height, 0);
              // } else {
              //   y = this.state.top;
              // }

              this.animateStartValue = {
                  x: this.state.left,
                  y: this.state.top,
              };
              this.animateFinalValue = {
                  x,
                  y,
              };
              this.animateStartTime = Date.now();
              this.startAnimate();*/
        }
    };

    callHandleMove = (diffX) => {
        if (!this.isCalledHandleStart) {
            this.isCalledHandleStart = true;
            if (this.handleStart) {
                this.handleStart();
            }
        }
        this.handleMove(diffX);
    };

    callHandleEnd = (isAllowChange) => {
        if (this.isCalledHandleStart) {
            this.isCalledHandleStart = false;
            if (this.handleEnd) {
                return this.handleEnd(isAllowChange);
            }
        }
    };

    easing = (distance) => {
        const t = distance;
        const b = 0;
        const d = screenWidth; // 允许拖拽的最大距离
        const c = d / 2.5; // 提示标签最大有效拖拽距离

        return (c * Math.sin((t / d) * (Math.PI / 2))) + b;
    };

    openPopupModal = () => {
        this.setState({popupModal: true})
    };

    sliderChange = (value) => {
        this.setState({currentPage: value,transformLeft: -this.perDistance * (value - 1)})
    };

    render() {
        const {
            transformLeft, left, top, scale,
            downloaded, loadingText, currentPage
        } = this.state;
        const defaultStyle = {};
        const duration = `${speed}ms`;
        defaultStyle.WebkitTransitionDuration = duration;
        defaultStyle.transitionDuration = duration;

        defaultStyle.left = `${transformLeft}px`;
        defaultStyle.transform = `${transformLeft}px`;

        let container = document.getElementsByClassName("pdf-container")[0];
        if (container) {
            let transformCanvas = document.getElementById('pageNum' + currentPage);
            if (transformCanvas) {
                transformCanvas.style.transform = `translate3d(${left}px, ${top}px, 0) scale(${scale})`;
            }
        }

        return (
            <div className="pdfImage">
                {
                    !downloaded ? (
                        <ActivityIndicator
                            toast
                            text={loadingText}
                            animating={!downloaded}
                        />
                    ) : (
                        <div
                            id='pdf-container'
                            className="pdf-container"
                            ref='pdfViewer'
                            style={{...defaultStyle, height: '100%'}}
                            onTouchStart={this.handleTouchStart}
                            onTouchMove={this.handleTouchMove}
                            onTouchEnd={this.handleTouchEnd}
                        />
                    )
                }
                <PopupModal
                    visible={this.state.popupModal}
                    onClose={() => this.setState({popupModal: false})}
                    className="pdfImage-popup-modal"
                >
                    <div className="pdfImage-popup-modal-content">
                        <div className="page">
                            <span>{`${this.state.currentPage}/${this.totalPages}`}</span>
                        </div>
                        <Slider
                            min={1}
                            value={this.state.currentPage}
                            max={this.totalPages}
                            onChange={this.sliderChange}
                            trackStyle={{
                                backgroundColor: '#e3252d',
                                height: '5px',
                            }}
                            handleStyle={{
                                borderColor: '#e3252d',
                                height: '14px',
                                width: '14px',
                                marginLeft: '-7px',
                                marginTop: '-4.5px',
                                backgroundColor: '#e3252d',
                            }}
                        />
                    </div>
                </PopupModal>
            </div>

        )
    }
}

PDFImage.defaultProps = {
    currentPage: 1
};


export default PDFImage;