const articles = require('./articles.js')
const comment = require('./comment.js')
const login = require("./login.js")

module.exports = (app) => {
    app.use(articles)
    app.use(comment)
    app.use(login)

}