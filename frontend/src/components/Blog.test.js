import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('Tests for Blog', () => {
  let component

  const mockHandler = jest.fn()

  const user = {
    username: 'testi',
    password: 'salainen',
    name: 'Testi Testaaja'
  }

  const testBlog = {
    title: 'Title for blog',
    author: 'Teemu',
    url: 'http://www.testi.fi',
    likes: 5,
    user: user
  }

  const getBloglist = f => f

  const showNotification = f => f

  beforeEach(() => {
    component = render(
      <Blog blog={testBlog} getBloglist={getBloglist} showNotification={showNotification} user={user} onClick={mockHandler} />
    )
  })

  test('initially only title and author are visible', () => {
    const divBasic = component.container.querySelector('.blogBasic')
    const divDetails = component.container.querySelector('.blogDetails')

    expect(divBasic).toHaveTextContent(`"${testBlog.title}" by ${testBlog.author}`)
    expect(divBasic).toHaveStyle('display: block')

    expect(divDetails).toHaveStyle('display: none')
  })

  test('all details after clicking', () => {
    const divBasic = component.container.querySelector('.blogBasic')
    const divDetails = component.container.querySelector('.blogDetails')

    fireEvent.click(divBasic)

    expect(divBasic).toHaveStyle('display: none')

    expect(divDetails).toHaveTextContent('5 likes')
    expect(divDetails).toHaveStyle('display: block')
  })
})