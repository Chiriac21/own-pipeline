import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import { describe } from 'vitest'
import userEvent from '@testing-library/user-event'

describe('BlogForm component', () => {

  test('check event handler for blog form', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup();

    render(<BlogForm onCreate={createBlog} />)

    const titleInput = screen.getByLabelText('title:')
    const authorInput = screen.getByLabelText('author:')
    const urlInput = screen.getByLabelText('url:')

    await user.type(titleInput, 'Testing title input')
    await user.type(authorInput, 'Testing author input')
    await user.type(urlInput, 'Testing url input')

    const createButton = screen.getByText('Create')
    await user.click(createButton)

    expect(createBlog.mock.calls).toHaveLength(1)

    expect(createBlog.mock.calls[0][0].title).toBe('Testing title input')
    expect(createBlog.mock.calls[0][0].author).toBe('Testing author input')
    expect(createBlog.mock.calls[0][0].url).toBe('Testing url input')
  })
})