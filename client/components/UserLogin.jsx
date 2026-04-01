import { useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import Notification from '../components/Notification'
import blogService from '../services/blogs'
import loginService from '../services/login'
import { setNotifMessage } from '../reducers/notificationReducer'
import { setActiveUser } from '../reducers/userReducer'
import {Button, Form, FloatingLabel } from 'react-bootstrap'

const UserLogin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch();
  const timeoutRef = useRef(null)

  const onLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('LoggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(setActiveUser(user))
      setUsername('')
      setPassword('')
    }catch{
      dispatch(setNotifMessage({ type: 'error', content: 'Wrong credentials'}, 5, timeoutRef))
    }
  }

  return (
    <div>
    <Form className="m-5 w-25 p-3 justify-content-center align-items-center mx-auto" onSubmit={onLogin}>
      <h2 className="mb-5">Log in to application</h2>
      <FloatingLabel
        controlId="floatingInput"
        label="Username"
        className="mb-5"
        >
        <Form.Control type="Text" placeholder="Username" 
          onChange={({ target }) => setUsername(target.value)}
          value={username}/>
      </FloatingLabel>
      <FloatingLabel controlId="floatingPassword" label="Password" className="mb-5">
        <Form.Control type="password" placeholder="Password" 
        value={password}
        onChange={({ target }) => setPassword(target.value)}/>
      </FloatingLabel>
      <Button variant="primary" type="submit" className="mb-4 justify-content-center align-items-center">
        Log in
      </Button>
      <Notification/>
    </Form>

    </div>
    )
}

export default UserLogin