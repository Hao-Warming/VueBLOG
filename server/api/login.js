const express = require('express')
const router = express.Router()
const db = require("../db/db.js")
const tokenObj = require("../middlewares/confirmToken")
const sha1 = require("sha1")

//返回token
router.post('/api/login', (req, res) => {
    var str = '';
    req.on("data", function(chunk) {
        str += chunk;
    })
    req.on("end", function() {
        var strJson = JSON.parse(str);
        db.User.findOne({ name: strJson.user }, (err, doc) => {
            if (err) {
                console.log(err)
            } else if (doc) {
                const salt = doc.salt;
                if (doc.password === sha1(strJson.password + salt)) {
                    const token = tokenObj.createToken(doc._id, doc.name);
                    res.status(200).send({
                        state: true,
                        name: doc.name,
                        token: token,
                        des: "登陆成功"
                    })
                } else { res.status(401).end() }
            }
        })
    })
})

//校验token
router.get('/api/checktoken', (req, res) => {
    var token = req.headers.authorization
    tokenObj.checkToken(token, res);
})

module.exports = router;