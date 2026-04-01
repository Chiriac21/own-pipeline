import { createSlice } from "@reduxjs/toolkit";
import usersService from "../services/users";

const usersSlice = createSlice({
    name: 'users',
    initialState: [],
    reducers: {
        fetchUsers(state, action) {
            return action.payload;
        }
    }
})


const {fetchUsers} = usersSlice.actions

export const getRegisteredUsers = () => {
    return async (dispatch) => {
        const users = await usersService.getAllUsers()
        dispatch(fetchUsers(users))
    }
}

export default usersSlice.reducer