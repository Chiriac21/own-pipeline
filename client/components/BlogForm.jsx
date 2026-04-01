import { useState } from 'react'
import {Button, Form } from 'react-bootstrap'

const BlogForm = ({ onCreate }) =>{
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')
    
    const addBlog = (event) => {
      event.preventDefault()
      onCreate({
        title,
        author,
        url
      })

      setTitle('')
      setAuthor('')
      setUrl('')
    }
    
    
    return (
    <div>
        <h2>Create new</h2>
        <Form onSubmit={addBlog}>
          <Form.Group className="mb-3" controlId="formGroupTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control type="text" placeholder="Enter title" 
            value={title} onChange={({ target }) => setTitle(target.value)}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupAuthor">
            <Form.Label>Author</Form.Label>
            <Form.Control type="text" placeholder="Enter author" 
            value={author} onChange={({ target }) => setAuthor(target.value)}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupUrl">
            <Form.Label>URL</Form.Label>
            <Form.Control type="text" placeholder="Enter URL" 
            value={url} onChange={({ target }) => setUrl(target.value)}/>
          </Form.Group>
          <Button variant="success" type="submit">
            Create
          </Button>
        </Form>
    </div>
    )
}

export default BlogForm