import { SETUSER } from './types';
const user = localStorage.getItem("user")

const INITIAL_STATE = user?JSON.parse(user):{email:"mvthomas121@gmail.com", name:"Vinoth Thomas", id:1635623671615}

const reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {

        case SETUSER:

            return {

                ...state, ...action.payload,

            };

        default: return state;

    }

};

export default reducer;