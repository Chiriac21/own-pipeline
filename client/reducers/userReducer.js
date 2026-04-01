import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser (state, action) {
        return action.payload
    }
  }
})

const { setUser } = userSlice.actions

export const setActiveUser = () => {
    return async (dispatch) => {
      const loggedBlogUser = window.localStorage.getItem('LoggedBlogappUser')
      if(loggedBlogUser){
        const user = JSON.parse(loggedBlogUser)
        dispatch(setUser(user))
        blogService.setToken(user.token)
      }
    }
}

export const setUserToNull = () => {
    return async (dispatch) => {
      window.localStorage.removeItem('LoggedBlogappUser')
      dispatch(setUser(null))
    }
}

export default userSlice.reducer