import {combineReducers} from "redux";

const aTest = (state = {}, action) => {
    switch (action.type) {
        case 'ATEST':
            return {
                ...state,
                ...action.info
            };
        default:
            return state
    }
};
const bTest = (state = [], action) => {
    switch (action.type) {
        case 'BTEST':
            return [...action.data];
        default:
            return state
    }
};


const cTest = (state = "", action) => {
    switch (action.type) {
        case 'CTEST':
            return action.value;
        default:
            return state
    }
};

export default combineReducers({
    aTest,
    bTest,
    cTest,
});
