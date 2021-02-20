//import cookie from 'react-cookies';

export const saveAppStateCookie = (name, value) => {
    cookie.save(name, value, {expires: new Date((new Date()).getTime() + 0x7fffffff * 1e3)});
};
export const removeAppStateCookie = (name) => {
    cookie.remove(name);
};