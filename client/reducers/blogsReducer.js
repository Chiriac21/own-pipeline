import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { setNotifMessage } from './notificationReducer'

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    addBlog(state, action){
      state.push(action.payload)
    },
    blogLiked(state, action) {
      return state.map(blog => {
        if (blog.id !== action.payload.id) return blog
        const returned = action.payload
        const returnedHasUserObject = returned.user && typeof returned.user === 'object' && returned.user.name
        if (returnedHasUserObject) return returned
        return { ...returned, user: blog.user }
      })
    },
    deleteBlog(state, action) {
      return state.filter(b => b.id !== action.payload)
    },
    setBlogs(state, action){
      return action.payload
    },
    addComment(state, action){
      return state.map(blog => {
        if (blog.id !== action.payload.id) return blog
        const returned = action.payload
        const returnedHasUserObject = returned.user && typeof returned.user === 'object' && returned.user.name
        if (returnedHasUserObject) return returned
        return { ...returned, user: blog.user }
      })
    }
  }
})

const { addBlog, setBlogs, deleteBlog, blogLiked, addComment } = blogsSlice.actions

export const increaseBlogLikes = (blog) => {
  return async (dispatch) => {
    const updatedBlog = {
      likes: blog.likes + 1,
    }

    const returned = await blogService.likeBlog(blog.id, updatedBlog)
    if (typeof setBlogs === 'function') {
      dispatch(blogLiked(returned))
    }
  }
}

export const removeBlog = (blog) => {
  return async (dispatch) => {
    const isConfirmed = window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`);
    if (isConfirmed) {
      try {
        await blogService.deleteBlog(blog.id);
        dispatch(deleteBlog(blog.id))
      } catch (error) {
        console.error("Error deleting blog:", error);
      }
    }
  }
}

export const appendBlog = (blogObject, user, timeoutRef) => {
  return async (dispatch) => {
    const returnedBlog = await blogService.createBlog(blogObject)
    const hasUserName = returnedBlog.user && returnedBlog.user.name
    const blogToAdd = hasUserName
        ? returnedBlog
        : {
          ...returnedBlog,
          user: {
            id: returnedBlog.user,
            username: user?.username,
            name: user?.name,
          }
        }
    dispatch(addBlog(blogToAdd))
    dispatch(setNotifMessage({ type: 'success', content: 'a new blog ' + blogToAdd.title + ' by ' + blogToAdd.author + ' added'}, 
        5, 
        timeoutRef))
  }
}

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs))
  }
}

export const commentBlog = (blog, comment) => {
  return async (dispatch) => {
    const returned = await blogService.addComment(blog.id, comment)
    if (typeof setBlogs === 'function') {
      dispatch(addComment(returned))
    }
  }
}

export default blogsSlice.reducer