import React from 'react'

const BlogForm = ({ addBlog, newTitleField, newAuthorField, newUrlField }) => {
  return (
    <div>
      <h2>Create a new blog</h2>

      <form onSubmit={addBlog}>
        <div>
          title:
          <input id="title" {...newTitleField.omitreset} />
        </div>
        <div>
          author:
          <input id="author" {...newAuthorField.omitreset} />
        </div>
        <div>
          url:
          <input id="url" {...newUrlField.omitreset} />
        </div>
        <button id="createnewbutton" type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm