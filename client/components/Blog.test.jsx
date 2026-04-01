import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import { describe } from 'vitest'
import userEvent from '@testing-library/user-event'

describe('Blog component', () => {
  test('renders blog title and author, but not url or likes by default', () => {
    const blog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://testblog.com',
      likes: 5,
      user: { id: 'user1', name: 'Test User' }
    }

    const { container } = render(<Blog blog={blog} user={blog.user} setBlogs={() => {}} />)

    const visibleElement = container.querySelector('#visible')
    const hiddenElement = container.querySelector('#hidden')

    expect(visibleElement).toHaveTextContent('Test Blog Test Author')
    expect(hiddenElement).not.toBeVisible()
  })

  test('renders url and likes when button is pressed', async () => {
    const blog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://testblog.com',
      likes: 5,
      user: { id: 'user1', name: 'Test User' }
    }

    const { container } = render(<Blog blog={blog} user={blog.user} setBlogs={() => {}} />)

    const hiddenElement = container.querySelector('#hidden')

    const user = userEvent.setup()
    const button = screen.getByText('View')
    await user.click(button)

    expect(hiddenElement).toBeVisible()
    expect(hiddenElement).toHaveTextContent('http://testblog.comlikes 5', {exact: false})
  })

  // test('check if like button is pressed twice', async () => {
  //   const blog = {
  //     title: 'Test Blog',
  //     author: 'Test Author',
  //     url: 'http://testblog.com',
  //     likes: 5,
  //     user: { id: 'user1', name: 'Test User' }
  //   }
    
  //   const mockHandler = vi.fn()

  //   render(<Blog blog={blog} user={blog.user} setBlogs={() => {}} onBlogLiked={mockHandler} />)

  //   const user = userEvent.setup();
  //   const viewButton = screen.getByText('View')

  //   await user.click(viewButton)

  //   const likeButton = screen.getByText('like')
  //   await user.click(likeButton)
  //   await user.click(likeButton)

  //   expect(mockHandler.mock.calls).toHaveLength(2)
  // })
})