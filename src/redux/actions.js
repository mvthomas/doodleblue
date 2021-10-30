import { SETUSER, SETCHAT, SETMESSAGE } from './types';

export const setCurrentUser = (data) => {
    return {
        type: SETUSER,
        payload: data
    };
};

export const setCurrentChat = (data) => {
    return {
        type: SETCHAT,
        payload: data
    };
};

export const setMessage = (data) => {
    return {
        type: SETMESSAGE,
        payload: data
    };
};