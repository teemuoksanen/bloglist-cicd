import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import SimpleBlog from './SimpleBlog'

describe('SimpleBlog', () => {
  let component

  const blog = {
    title: 'Title for blog',
    author: 'Teemu',
    likes: 5
  }

  const mockHandler = jest.fn()

  beforeEach(() => {
    component = render(
      <SimpleBlog blog={blog} onClick={mockHandler} />
    )
  })

  test('has right content', async () => {
    const blogDetails = component.container.querySelector('.blogDetails')
    const blogLike = component.container.querySelector('.blogLike')
    expect(blogDetails).toHaveTextContent(
      `${blog.title} ${blog.author}`
    )
    expect(blogLike).toHaveTextContent(
      `blog has ${blog.likes} likes`
    )
  })

  test('clicking the button twice calls event handler twice', () => {
    const button = component.getByText('like')
    fireEvent.click(button)
    fireEvent.click(button)
    expect(mockHandler.mock.calls.length).toBe(2)
  })

})