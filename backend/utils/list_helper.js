const _ = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  const likes = _.sumBy(blogs, 'likes')
  return likes
}

const favoriteBlog = (blogs) => {
  const mostLikes = _.maxBy(blogs, 'likes')
  return mostLikes === undefined
    ? {}
    : {
      'title': mostLikes.title,
      'author': mostLikes.author,
      'likes': mostLikes.likes
    }
}

const mostBlogs = (blogs) => {
  const authorMostBlogs = _(blogs)
    .countBy('author')
    .map((value, prop) => ({ 'author': prop, 'blogs': value }))
    .maxBy('blogs')
  return authorMostBlogs === undefined
    ? {}
    : authorMostBlogs
}

const mostLikes = (blogs) => {
  const authorMostLikes = _(blogs)
    .groupBy('author')
    .map((value, author) => ({
      'author': author,
      'likes': _.sumBy(value, 'likes')
    }))
    .maxBy('likes')
  return authorMostLikes === undefined
    ? {}
    : authorMostLikes
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}