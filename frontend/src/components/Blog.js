import React, { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const Blog = ({ blog, getBloglist, showNotification, user }) => {
  const [full, setFull] = useState(false)

  const likeBlog = (event) => {
    event.preventDefault()

    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      user: blog.user,
      likes: blog.likes+1
    }

    blogService
      .update(blog.id, updatedBlog)
      .then(getBloglist())
  }

  const deleteBlog = async () => {
    if (window.confirm(`Do you really want to remove "${blog.title}" by ${blog.author}?`)) {
      await blogService.remove(blog.id)
      getBloglist()
      showNotification(`Blog "${blog.title}" by ${blog.author} was removed successfully!`, 'success')
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const hideWhenFull = { display: full ? 'none' : '' }
  const showWhenFull = { display: full ? '' : 'none' }

  const toggleDetails = () => {
    setFull(!full)
  }

  return (
    <div style={blogStyle} className="blog">
      <div style={hideWhenFull} onClick={toggleDetails} className="blogBasic">
      &quot;{blog.title}&quot; by {blog.author}
      </div>
      <div style={showWhenFull} className="blogDetails">
        <div onClick={toggleDetails}>&quot;{blog.title}&quot; by {blog.author}</div>
        <div><a href="{blog.url}">{blog.url}</a></div>
        <div>{blog.likes} {blog.likes === 1 ? 'like' : 'likes'} <button onClick={likeBlog}>like</button></div>
        <div>added by {blog.user.name}</div>
        <div>{(user.username === blog.user.username) && <button onClick={deleteBlog}>remove</button>}</div>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  getBloglist: PropTypes.func.isRequired,
  showNotification: PropTypes.func.isRequired,
  user: PropTypes.object
}

export default Blog