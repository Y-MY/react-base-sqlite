const aTest = info => {
    return {
        type: "ATEST",
        info
    }
};
const BTest = data => {
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
    BTest,
    cTest
}