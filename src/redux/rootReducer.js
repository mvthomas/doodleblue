import { combineReducers } from 'redux';
import counterReducer from './reducer';
import chatReducer from './chatReducer';
import messageReducer from './messageReducer';

const Reducer = combineReducers({
    user: counterReducer,
    chat: chatReducer,
    messages: messageReducer
});

export default Reducer;