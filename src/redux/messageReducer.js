import { SETMESSAGE } from './types';

const INITIAL_STATE = {texts:[]}

const messageReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SETMESSAGE:
            return {
                ...state, ...action.payload,
            };
        default: return state;
    }
};

export default messageReducer;