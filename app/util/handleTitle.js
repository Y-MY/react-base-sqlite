import Stack from "./stack";

let stack = new Stack();
const MaxLength = 5;

/*
* pathname
* isFromPathName true代表从pathname取path
**/
export const customPushMenu = (menu) => {
    // console.log('***push before',localStorage.getItem('custom-history'));
    let menus = JSON.parse(localStorage.getItem('custom-title'));
    if (menus && menus.length) {
        stack.init(menus);
    }
    stack.push(menu);
    localStorage.setItem("custom-title", JSON.stringify(stack.getData()));
};

export const customPopMenu = () => {
    // console.log('***back before',localStorage.getItem('custom-history'));
    let menus = JSON.parse(localStorage.getItem('custom-title'));
    if (menus && menus.length) {
        stack.init(menus);
    }
    let menu = stack.peek();
    stack.pop();
    if (stack.getData().length > MaxLength) {
        let newArr = stack.getData().filter((item, index) => index > MaxLength / 2);
        stack.init(newArr);
    }
    //  console.log('***back after',localStorage.getItem(stack.getData()));
    localStorage.setItem("custom-title", JSON.stringify(stack.getData()));
    return menu;
};


export const customPeekMenu = () => {
    // console.log('***back before',localStorage.getItem('custom-history'));
    let menus = JSON.parse(localStorage.getItem('custom-title'));
    if (menus && menus.length) {
        stack.init(menus);
    }
    return stack.peek();
};

export const resetPath = () => {
    stack.init([]);
};


