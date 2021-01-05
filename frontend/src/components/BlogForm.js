import React from 'react'

const BlogForm = ({ addBlog, newTitleField, newAuthorField, newUrlField }) => {
  return (
    <div>
      <h2>Create a new blog</h2>

      <form onSubmit={addBlog}>
        <div>
          title:
          <input {...newTitleField.omitreset} />
        </div>
        <div>
          author:
          <input {...newAuthorField.omitreset} />
        </div>
        <div>
          url:
          <input {...newUrlField.omitreset} />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm