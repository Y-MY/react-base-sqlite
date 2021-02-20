const aTest = info => {
    return {
        type: "ATEST",
        info
    }
};
const bTest = data => {
    return {
        type: "BTEST",
        data
    }
};
const cTest = value => {
    return {
        type: "CTEST",
        value
    }
};


export {
    aTest,
    bTest,
    cTest
}