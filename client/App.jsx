import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getRegisteredUsers } from './reducers/usersReducer'
import { initializeBlogs } from './reducers/blogsReducer'
import { setActiveUser, setUserToNull } from './reducers/userReducer'
import { Routes, Route, Link, useMatch } from 'react-router-dom'
import UserLogin from './components/UserLogin'
import { Users, User } from './components/Users'
import Home from './components/Home'
import Notification from './components/Notification'
import Blog from './components/Blog'
import { Button, Container, Nav, Navbar } from 'react-bootstrap'

const App = () => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const registeredUsers = useSelector(state => state.users)

  const userMatch = useMatch('/users/:id')
  const registeredUser = userMatch
    ? registeredUsers.find(user => user.id === userMatch.params.id)
    : null

  const blogMatch = useMatch('/blogs/:id')
  const blogToFind = blogMatch
    ? blogs.find(blog => blog.id === blogMatch.params.id)
    : null

  const onLogout= () => {
    dispatch(setUserToNull())
  }

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(setActiveUser())
    dispatch(getRegisteredUsers())
  }, [dispatch])

  const pageStyle = {
    margin: 10
  }

  if(user === null){
    return (
      <UserLogin/>
    )
  }

  return (
    <div>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container className='mx-auto'>
          <Navbar.Brand href="/">Blog App</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/">Blogs</Nav.Link>
            <Nav.Link href="/users">Users</Nav.Link>
          </Nav>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
            Signed in as: <a href={'/users'}>{user.name}</a>
              <Button className="ms-3" variant="secondary" onClick={onLogout}>Logout</Button>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br/>
      <div style={pageStyle}>
        <Notification/>
        <Routes>
          <Route path="/" element={<Home user={user} blogs={blogs}/>}/>
          <Route path="/users" element={<Users users={registeredUsers} />}/>
          <Route path="/users/:id" element={<User user={registeredUser}/>} />
          <Route path="/blogs/:id" element={<Blog blog={blogToFind} user={user}/>}/>
        </Routes>
      </div>
    </div>
  )
}

export default App