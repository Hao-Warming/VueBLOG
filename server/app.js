const express = require('express')
const bodyParser = require('body-parser');
const route = require('./api/index.js')
const app = express()


//解析前端发来的请求
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


app.set('port', (process.env.VUE_APP_PORT) || 3004)


route(app)
app.listen(app.get('port'), function() {
    console.log('GetData http://localhost:' + app.get('port'))
})