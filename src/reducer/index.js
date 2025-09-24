import {combineReducers} from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import notesReducer from "../slices/notesSlice";
import tenantReducer from "../slices/tenantSlice";


const rootReducer = combineReducers({
    auth: authReducer,
    notes: notesReducer,
    tenant: tenantReducer,
})

export default rootReducer