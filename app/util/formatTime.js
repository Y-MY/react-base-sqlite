const formatDate = (obj, key) => {
    let time=obj && obj[key] ? new Date(obj[key].replace(/-/g, '/')) : ""
    console.log('@@@@time',time)
    return time
};
export {
    formatDate
}