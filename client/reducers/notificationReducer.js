import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: {type: null, message: null},
    reducers:{
        setNotification(state, action) {
            switch(action.payload?.type){
                case "success":
                    return {type: "success", message: action.payload.content}
                case "error":
                    return {type: "error", message: action.payload.content}
                default:
                    return {type: null, message: null}
            }
        }
    }
})

const { setNotification } = notificationSlice.actions

export const setNotifMessage = ({type, content}, timeout, timeoutRef) => {
    return async (dispatch) => {
        dispatch(setNotification({type, content}))
        if (timeoutRef.current) {
              clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(() => {
            dispatch(setNotification(null))
            timeoutRef.current = null
        }, timeout * 1000)
    }
}

export default notificationSlice.reducer