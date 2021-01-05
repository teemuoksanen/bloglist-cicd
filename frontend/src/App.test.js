import React from 'react'
import { render, waitForElement } from '@testing-library/react'
jest.mock('./services/blogs')
import App from './App'

describe('<App />', () => {

  test('if no user logged, notes are not rendered', async () => {
    const component = render(
      <App />
    )
    component.rerender(<App />)

    await waitForElement(
      () => component.getByText('login')
    )

    // expectations here
    expect(component.container).toHaveTextContent(
      'Log in to application'
    )

    const blogs = component.container.querySelectorAll('.blog')
    expect(blogs.length).toBe(0)

  })

  test('if user is logged, notes are rendered', async () => {

    const user = {
      username: 'teemuo',
      token: '5d4981665550eeaaa8fde5ca',
      name: 'Teemu Oksanen'
    }

    localStorage.setItem('loggedBloglistappUser', JSON.stringify(user))

    const component = render(
      <App />
    )
    component.rerender(<App />)

    await waitForElement(
      () => component.container.querySelector('.blog')
    )

    // expectations here
    expect(component.container).toHaveTextContent(
      'Blogs'
    )

    const blogs = component.container.querySelectorAll('.blog')
    expect(blogs.length).toBe(3)

  })

})