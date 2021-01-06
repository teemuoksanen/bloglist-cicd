const mongoose = require('mongoose')
const supertest = require('supertest')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

let token = null
let decodedToken = {}

describe('when there is initially some blogs saved', () => {

  beforeAll(async () => {
    const credentials = {
      username: 'root',
      password: 'salainen'
    }
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash(credentials.password, 10)
    const user = new User({
      username: credentials.username,
      name: 'Admin',
      passwordHash
    })
    await user.save()
    const result = await api
      .post('/api/login')
      .send(credentials)
    token = result.body.token
    try {
      decodedToken = jwt.verify(token, process.env.SECRET)
    } catch(e) {
      console.error('token could not be decoded', e)
    }
    for(let i=0; i<helper.initialBlogs.length; i++) {
      helper.initialBlogs[i].user = decodedToken.id
    }
  })

  beforeEach(async () => {
    await Blog.remove({})

    for (let blog of helper.initialBlogs) {
      let blogObject = new Blog(blog)
      await blogObject.save()
    }
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body.length).toBe(helper.initialBlogs.length)
  })

  test('the first blog is about React patterns', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].title).toBe('React patterns')
  })

  test('there is a correct id field', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })

  describe('creating a blog', () => {

    test('is possible when the created blog is valid', async () => {
      const newBlog = {
        title: 'This is a test blog.',
        author: 'Test Author',
        url: 'http://www.fi/',
        likes: 0
      }

      await api
        .post('/api/blogs')
        .set('Authorization', 'bearer ' + token)
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

      const title = blogsAtEnd.map(b => b.title)
      expect(title).toContain(
        'This is a test blog.'
      )
    })

    test('without likes will have 0 likes', async () => {
      const newBlog = {
        title: 'This test blog has no like.',
        author: 'Test Author',
        url: 'http://www.helsinki.fi/'
      }

      await api
        .post('/api/blogs')
        .set('Authorization', 'bearer ' + token)
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd[blogsAtEnd.length-1].likes).toBe(0)
    })

    test('without title and url returns 400', async () => {
      const newBlog = {
        author: 'Not Gonna Add This'
      }

      await api
        .post('/api/blogs')
        .set('Authorization', 'bearer ' + token)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
    })

  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', 'bearer ' + token)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd.length).toBe(helper.initialBlogs.length - 1)

      const title = blogsAtEnd.map(r => r.title)

      expect(title).not.toContain(blogToDelete.title)
    })
  })

  describe('modifying of a blog', () => {
    test('with additional like succeeds with status code 200', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToModify = blogsAtStart[0]

      const modifiedBlog  = {
        title: blogToModify.title,
        author: blogToModify.author,
        url: blogToModify.url,
        likes: blogToModify.likes + 1
      }

      await api
        .put(`/api/blogs/${blogToModify.id}`)
        .set('Authorization', 'bearer ' + token)
        .send(modifiedBlog)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd[0].likes).toBe(blogToModify.likes + 1)
    })
  })

})

afterAll(() => {
  mongoose.connection.close()
})