const express = require('express')
const router = express.Router()
const db = require('../db/db.js')
const { count } = require('../db/sequence.js')



// 获取某一篇文章的所有评论
router.get("/api/getComments", (req, res) => {
    db.Comment.count({ articleId: req.query.articleId }).then(num => {
        var obj = {}
        obj.count = num;
        db.Comment.find({ articleId: req.query.articleId }, { articleId: 0, _id: 0 }).sort({ order: -1 }).exec().then(comments => {
            obj.comments = comments;
            res.status(200).send(obj)
        })
    })

})

//提交评论
router.post("/api/postComment", (req, res) => {
    var str = '';
    req.on("data", function(chunk) {
        str += chunk;
    });
    req.on("end", function() {
        var strJson = JSON.parse(str)
            // console.log(strJson);
        if (strJson.chosedIndex == -1) {
            //一级评论
            db.Comment.count({ articleId: strJson.articleId }).then(num => {
                num++;
                var obj = {
                    order: num,
                    name: strJson.formData.userName,
                    address: strJson.formData.userMail,
                    content: strJson.formData.userContent,
                    articleId: strJson.articleId,
                    date: strJson.time,
                    replyBox: []
                }
                db.Comment.create(obj, (err, doc) => {
                    if (err) {
                        console.log("添加失败")
                    } else {
                        console.log("添加成功")
                    }
                })
            })
        } else {
            //二级评论
            db.Comment.find({ order: strJson.chosedIndex }).then(doc => {
                var reply_order = doc[0].replyBox.length + 1
                var obj = {
                    reply_order: reply_order,
                    reply_creatAt: strJson.time,
                    reply_name: strJson.formData.userName,
                    reply_text: strJson.formData.userContent,
                    told: strJson.told,
                    reply_address: strJson.formData.userMail
                }
                db.Comment.updateOne({ order: strJson.chosedIndex }, { $push: { replyBox: obj } }, (err, result) => {
                    if (err) {
                        console.log("插入失败")
                    } else {
                        console.log("插入成功")
                    }
                })
            })

        }
        res.end(str);
    });

})
module.exports = router;