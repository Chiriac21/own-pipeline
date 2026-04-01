import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null;

const setToken = newToken => {
  token = `Bearer ${newToken}`;
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createBlog = async (newBlog) => {
  const config = {
    headers : { Authorization: token }
  }
  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const likeBlog = async (id, updatedBlog) => {
  const response = await axios.put(`${baseUrl}/${id}`, updatedBlog)
  return response.data
}

const deleteBlog = async (id) => {
  const config = {
    headers : { Authorization: token }
  }
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

const addComment = async (id, comment) => {
  const response = await axios.post(`${baseUrl}/${id}/comments`, {comment})
  return response.data
}

export default { getAll, createBlog, likeBlog, deleteBlog, setToken, addComment }