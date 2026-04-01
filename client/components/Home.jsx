import { useRef } from 'react'
import Toggleable from '../components/Toggable'
import BlogForm from '../components/BlogForm'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { appendBlog } from '../reducers/blogsReducer'

const Home = ({user, blogs}) => {
  const timeoutRef = useRef(null)
  const blogsFormRef = useRef()
  const dispatch = useDispatch()

  const onCreate = (blogObject) => {
    blogsFormRef.current.toggleVisibility()
    dispatch(appendBlog(blogObject, user, timeoutRef))
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    display: blogs.length > 0 ? '' : 'none'
  }

  return (
    <>
      <Toggleable acceptButtonLabel="Create new blog" cancelButtonLabel="Cancel" ref={blogsFormRef}>
        <BlogForm onCreate={onCreate}/>
      </Toggleable><br/><br/>
      <div>
        {
          [...blogs].map(blog => <div style={blogStyle} key={blog.id}><Link to={`/blogs/${blog.id}`} key={blog.id}>{blog.title}</Link></div>)
        }
      </div>
    </>
  )
}

export default Home