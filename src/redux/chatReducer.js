import { SETCHAT } from './types';

const INITIAL_STATE = {}

const chatReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SETCHAT:
            return {
                ...state, ...action.payload,
            };
        default: return state;
    }
};

export default chatReducer;