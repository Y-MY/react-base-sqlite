class Stack {
    constructor() {
        this.items = [];
    };

    init(arr) {
        this.items = arr;
    }

    getData() {
        return this.items;
    }

    push(value) {
        this.items.push(value);
    };

    pop() {
        if(this.items.length>1){
            this.items.pop();
        }
      /*  console.log('pop',this.items)*/
        return this.items;
    };

    peek() {
        return this.items[this.items.length - 1];
    };

    isEmpty() {
        return this.items.length === 0;
    };

    clear() {
        return this.items = [];
    };

    size() {
        return this.items.length;
    }
}

export default Stack;