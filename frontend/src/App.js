import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import { useField } from './hooks'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState({ message: null })
  const [user, setUser] = useState(null)

  const usernameField = useField('text')
  const passwordField = useField('password')
  const newTitleField = useField('text')
  const newAuthorField = useField('text')
  const newUrlField = useField('text')

  useEffect(() => {
    getBloglist()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => setNotification({ message: null }), 5000)
  }

  const blogFormRef = React.createRef()

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm
        addBlog={addBlog}
        newTitleField={newTitleField}
        newAuthorField={newAuthorField}
        newUrlField={newUrlField}
      />
    </Togglable>
  )

  const getBloglist = () => {
    blogService.getAll()
      .then(blogs =>
        setBlogs(blogs)
      )
  }

  const addBlog = (event) => {
    event.preventDefault()

    const newTitle = newTitleField.value
    const newAuthor = newAuthorField.value
    const newUrl = newUrlField.value

    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      user: user
    }

    blogService
      .create(blogObject)
      .then(() => {
        getBloglist()
        showNotification(`A new blog "${newTitle}" by ${newAuthor} was added successfully!`, 'success')
        newTitleField.reset()
        newAuthorField.reset()
        newUrlField.reset()
      })
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const username = usernameField.value
      const password = passwordField.value
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBloglistappUser', JSON.stringify(user)
      )
      setUser(user)
      showNotification(`Welocme, ${user.name}!`, 'success')
      usernameField.reset()
      passwordField.reset()
    } catch (exception) {
      showNotification('Wrong username or password!', 'error')
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    try {
      window.localStorage.removeItem('loggedBloglistappUser')
      showNotification(`${user.name} logged out successfully!`, 'success')
      setUser(null)
      usernameField.reset()
      passwordField.reset()
    } catch (exception) {
      showNotification('Logout failed!', 'error')
    }
  }

  if (user === null) {

    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notification.message} type={notification.type} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input  {...usernameField.omitreset} />
          </div>
          <div>
            password
            <input  {...passwordField.omitreset} />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={notification.message} type={notification.type} />
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      {blogForm()}
      {blogs.sort(function (a, b){
        return b.likes - a.likes
      }).map(blog =>
        <Blog key={blog.id} blog={blog} getBloglist={getBloglist} showNotification={showNotification} user={user} />
      )}
    </div>
  )
}

export default App