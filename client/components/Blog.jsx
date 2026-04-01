import { useState } from 'react'
import { removeBlog, increaseBlogLikes, commentBlog } from '../reducers/blogsReducer'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Blog = ({ blog, user }) => {
  const navigate = useNavigate()
  const [comment, setComment] = useState('')

  const dispatch = useDispatch();

  const deleteVisibility = user && blog.user.username === user.username ? false : true
  const deleteButtonStyle = { display: deleteVisibility ? 'none' : '' }

  const onBlogLiked = async () => {
    dispatch(increaseBlogLikes(blog))
  }

  const onDeleteBlog = async () => {
    dispatch(removeBlog(blog))
    navigate('/')
  }

  const onCommentAdded = () => {
    dispatch(commentBlog(blog, comment))
    setComment('')
  }

   const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  if(!user || !blog)
  {
    return null
  }

  return(
  <>
  <div style={blogStyle} data-testid="blog">
    <h2>{blog.title}</h2>
    <p><a href="#">{blog.url}</a></p>
    <p>likes {blog.likes} <button onClick={onBlogLiked}>like</button></p>
    <p>added by {blog.user.name}</p>
    <div style={deleteButtonStyle}>
      <button onClick={onDeleteBlog}>Remove</button>
    </div>
  </div> 
  <div>
      <h3>comments</h3>
      <label>
        <input value={comment} onChange={(e) => setComment(e.target.value)} />
        <button type="button" onClick={onCommentAdded}>Add comment</button>
      </label>
      <ul>
        {
          blog.comments.map(comment => <li key={comment}>{comment}</li>)
        }
      </ul>
  </div>
  </>
  ) 
}

export default Blog