import Stack from "./stack";

let stack = new Stack();
const MaxLength = 30;

/*
* pathname
* isFromPathName true代表从pathname取path
**/
export const customPush = (pathname, isFromPathName = true) => {
    // console.log('***push before',localStorage.getItem('custom-history'));
    let path = isFromPathName ? `/${pathname.split('/')[1]}` : pathname;
    let history = JSON.parse(localStorage.getItem('custom-history'));
    if (history && history.length) {
        stack.init(history);
    }
    stack.push(path);
    localStorage.setItem("custom-history", JSON.stringify(stack.getData()));
};

export const customGoBack = () => {
    // console.log('***back before',localStorage.getItem('custom-history'));
    let history = JSON.parse(localStorage.getItem('custom-history'));
    if (history && history.length) {
        stack.init(history);
    }
    let backPath = stack.peek();
    stack.pop();
    console.log(stack)
    if (stack.getData().length > MaxLength) {
        let newArr = stack.getData().filter((item, index) => index > MaxLength / 2);
        stack.init(newArr);
    }
    //  console.log('***back after',localStorage.getItem(stack.getData()));
    localStorage.setItem("custom-history", JSON.stringify(stack.getData()));
    //  console.log('***back backPath',backPath);
    return backPath;
};

export const resetPath = () => {
    stack.init([]);
};

export const setBackPath = (path) => {
    // localStorage.setItem("custom-history", path);
};

export const getBackPath = () => {
    // return localStorage.getItem('custom-history');
};


