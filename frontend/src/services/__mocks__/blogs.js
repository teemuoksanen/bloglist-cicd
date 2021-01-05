const blogs = [
  {
    id: '5d498b2cb1c98abb1f7e3f63',
    title: 'This is test blog',
    author: 'Matti Luukkainen',
    url: 'http://www.helsinki.fi',
    likes: 3,
    user: {
      id: '5d4981665550eeaaa8fde5ca',
      username: 'teemuo',
      name: 'Teemu Oksanen'
    }
  },
  {
    id: '5a451e21e0b8b04a45638211',
    title: 'Best blog in town',
    author: 'Teemu Oksanen',
    url: 'http://www.teemuoksanen.fi',
    likes: 12,
    user: {
      id: '5d4981665550eeaaa8fde5ca',
      username: 'teemuo',
      name: 'Teemu Oksanen'
    }
  },
  {
    id: '5a451e21e0b8b04a45621111',
    title: 'No one likes me',
    author: 'D. Trump',
    url: 'http://www.whitehouse.gov',
    likes: 0,
    user: {
      id: '5d4981665550eeaaa8fde5ca',
      username: 'teemuo',
      name: 'Teemu Oksanen'
    }
  }
]

const getAll = () => {
  return Promise.resolve(blogs)
}

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

export default { getAll, setToken, token }