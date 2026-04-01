const _ = require('lodash')

const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {

    return blogs.length === 0
    ? 0
    : blogs.reduce((acc, blog) => acc + blog.likes, 0);
}

const favoriteBlog = (blogs) => {
    return blogs.lenght === 0
    ? 0 
    : blogs.reduce((max, blog) => {return blog.likes > max.likes ? blog : max})
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;

  const counts = _.countBy(blogs, 'author');
  const topAuthor = _.maxBy(Object.keys(counts), author => counts[author]);

  return { author: topAuthor, blogs: counts[topAuthor] };
}

const mostLikes = (blogs) => {
  const authorLikes =  _.mapValues(_.groupBy(blogs, 'author'), (authorBlogs) =>
    _.sumBy(authorBlogs, 'likes')
  );

  const topLikedAuthor = _.maxBy(Object.keys(authorLikes), author => authorLikes[author])
  return {author: topLikedAuthor, likes: authorLikes[topLikedAuthor]}
}

module.exports = { 
    dummy,
    totalLikes, 
    favoriteBlog, 
    mostBlogs,
    mostLikes 
}
