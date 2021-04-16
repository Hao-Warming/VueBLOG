const express = require('express')
const { Archives } = require('../db/db.js')
const router = express.Router()
const db = require('../db/db.js')


//获取单条数据
router.get('/api/article', (req, res) => {
    db.Article.findOne({ aid: req.query.aid }, { aid: 0, _id: 0, comment_n: 0 }, (err, doc) => {
        if ((err)) {
            console.log(err)
        } else {
            res.status(200).send(doc)
        }
    })
})

// 获取分页数据
function switchTag(path) {
    switch (path) {
        case '/sort/basic':
            return '前端基础';
            break;
        case '/sort/aboutVue':
            return "关于Vue";
            break;
        case '/sort/life':
            return "生活杂谈";
            break;
        default:
            return "全部";
    }
}
router.get('/api/articlesdata', (req, res) => {
    const page = req.query.currentPage || 1;
    const path = req.query.currentPath || '/'
    const limit = 5;
    const startIndex = (page - 1) * limit //起始索引
    const tags = switchTag(path)
    if (tags === '全部') {
        db.Article.count({}).then(num => {
            var obj = {}
            obj.total = num;
            db.Article.find({}, { _id: 0, content: 0 }).sort({ aid: 1 }).limit(5).skip(startIndex).then(doc => {
                obj.doc = doc
                res.status(200).send(obj)
            })
        })
    } else {
        db.Article.count({ tags: tags }).then(num => {
            var obj = {}
            obj.total = num;
            obj.tag = tags;
            db.Article.find({ tags: tags }, { _id: 0 }).sort({ aid: 1 }).limit(5).skip(startIndex).then(doc => {
                obj.doc = doc
                res.status(200).send(obj)
            })
        })


    }
})

//获取热门文章
router.get('/api/recommends', (req, res) => {
    db.Article.find({}, { _id: 0, aid: 1, title: 1 }).limit(6).sort({ aid: -1 }).exec().then(doc => {
        res.send(doc)
    })
})

//文档
router.get('/api/archives', (req, res) => {
    db.Archives.find({}, { _id: 0 }).sort({ date: -1 }).exec().then(doc => {
        res.send(doc)
    })
})

//添加单条数据
router.post('/api/editone', (req, res) => {
    var str = '';
    req.on("data", function(chunk) {
        str += chunk;
    });
    req.on('end', function() {
        var strJson = JSON.parse(str)

        db.Archives.findOne({ date: strJson.date }).then(doc => {
            if (doc == null) {
                db.Article.count({}).then(num => {
                    num++;
                    var obj = {
                        tags: [strJson.tag],
                        title: strJson.title,
                        content: strJson.mdContent,
                        html_content: strJson.htmlContent,
                        date_detail: strJson.detailtime,
                        date: strJson.date,
                        comment_n: 0,
                        like_n: 0,
                        reads_n: 0,
                        aid: num
                    }
                    var archivesObj = {
                        aid: num,
                        title: strJson.title,
                        creatAt: strJson.formaldate
                    }
                    db.Archives.create({ date: strJson.date, data: archivesObj }).then(() => { console.log("ok") }).catch(err => { console.log("fail") })

                    db.Article.create(obj, (err, doc) => {
                        if (err) {
                            console.log("添加失败")
                        } else {
                            console.log("添加成功")
                            res.status(200).end("添加成功")
                        }
                    })
                })

            } else if (strJson.aid.aid) {
                //获取目标文档的索引
                db.Archives.findOne({ date: strJson.date }, (err, doc) => {
                    if (err) {
                        console.log("报错")
                    } else {
                        for (var i = 0; i < doc.data.length; i++) {
                            if (String(doc.data[i].aid).indexOf(String(strJson.aid.aid)) == 0) {
                                var index = i;
                                var target = 'data.' + index + '.title' //筛选目标文档
                                db.Archives.updateOne({ date: strJson.date }, {
                                    $set: {
                                        [target]: strJson.title
                                    }
                                }, { "upsert": true }, function(err, data) {
                                    if (err) {
                                        console.log("更改归档失败")
                                    } else {
                                        console.log("探针3")
                                        console.log(data)
                                    }
                                })
                            }
                        }
                    }
                })

                db.Article.updateOne({ aid: strJson.aid.aid }, { $set: { tags: [strJson.tag], title: strJson.title, content: strJson.mdContent, html_content: strJson.htmlContent, date_detail: strJson.detailtime, date: strJson.date } }, function(err, result) {
                    if (err) {
                        console.log("更改失败")
                    } else {
                        console.log("更改成功")
                        res.status(200).end("更改成功")
                    }
                })
            } else {
                db.Article.count({}).then(num => {
                    num++;
                    var obj = {
                        tags: [strJson.tag],
                        title: strJson.title,
                        content: strJson.mdContent,
                        html_content: strJson.htmlContent,
                        date_detail: strJson.detailtime,
                        date: strJson.date,
                        comment_n: 0,
                        like_n: 0,
                        reads_n: 0,
                        aid: num
                    }
                    var archivesObj = {
                        aid: num,
                        title: strJson.title,
                        creatAt: strJson.formaldate
                    }
                    db.Archives.updateOne({ date: strJson.date }, { $addToSet: { data: archivesObj } }, function(err, doc) {
                        if (err) {
                            console.log("插入文档失败")
                        } else {
                            console.log(doc)
                        }
                    })
                    db.Article.create(obj, (err, doc) => {
                        if (err) {
                            console.log("添加失败")
                        } else {
                            console.log("添加成功")
                            res.status(200).end("添加成功")
                        }
                    })
                })

            }
        }).catch(err => {
            console.log("失败了")
        })

        // if (strJson.aid.aid) {
        //     //获取目标文档的索引
        //     db.Archives.findOne({ date: strJson.date }, (err, doc) => {
        //         if (err) {
        //             console.log("报错")
        //         } else {
        //             for (var i = 0; i < doc.data.length; i++) {
        //                 if (String(doc.data[i].aid).indexOf(String(strJson.aid.aid)) == 0) {
        //                     var index = i;
        //                     var target = 'data.' + index + '.title' //筛选目标文档
        //                     db.Archives.updateOne({ date: strJson.date }, {
        //                         $set: {
        //                             [target]: strJson.title
        //                         }
        //                     }, { "upsert": true }, function(err, data) {
        //                         if (err) {
        //                             console.log("更改归档失败")
        //                         } else {
        //                             console.log(data)
        //                         }
        //                     })
        //                 }
        //             }
        //         }
        //     })

        //     db.Article.updateOne({ aid: strJson.aid.aid }, { $set: { tags: [strJson.tag], title: strJson.title, content: strJson.mdContent, html_content: strJson.htmlContent, date_detail: strJson.detailtime, date: strJson.date } }, function(err, result) {
        //         if (err) {
        //             console.log("更改失败")
        //         } else {
        //             console.log("更改成功")
        //             res.status(200).end("更改成功")
        //         }
        //     })
        // } else {
        //     db.Article.count({}).then(num => {
        //         num++;
        //         var obj = {
        //             tags: [strJson.tag],
        //             title: strJson.title,
        //             content: strJson.mdContent,
        //             html_content: strJson.htmlContent,
        //             date_detail: strJson.detailtime,
        //             date: strJson.date,
        //             comment_n: 0,
        //             like_n: 0,
        //             reads_n: 0,
        //             aid: num
        //         }
        //         var archivesObj = {
        //             aid: num,
        //             title: strJson.title,
        //             creatAt: strJson.formaldate
        //         }

        //         db.Archives.create({ date: 2022, data: archivesObj }).then(() => { console.log("ok") }).catch(err => { console.log("fail") })
        //         db.Archives.updateOne({ date: strJson.date }, { $addToSet: { data: archivesObj } }, function(err, doc) {
        //             if (err) {
        //                 console.log("插入文档失败")
        //             } else {
        //                 console.log(doc)
        //             }
        //         })
        //         db.Article.create(obj, (err, doc) => {
        //             if (err) {
        //                 console.log("添加失败")
        //             } else {
        //                 console.log("添加成功")
        //                 res.status(200).end("添加成功")
        //             }
        //         })
        //     })

        // }
    })
})

//删除单条数据
router.post('/api/removeone', (req, res) => {
    var str = '';
    req.on("data", function(chunk) {
        str += chunk;
    })
    req.on("end", function() {
        var strJson = JSON.parse(str);
        console.log(strJson)
        console.log(typeof strJson.date)
        db.Archives.updateOne({ date: strJson.date }, {
            $pull: {
                "data": { "aid": Number(strJson.aid) }
            }
        }, function(err, data) {
            if (err) {
                console.log("删除归档失败")
            } else {
                console.log(data)
            }
        })
        db.Article.deleteOne({ aid: strJson.aid }).then(doc => {
            res.end("删除成功")
        })
    })
})

//点赞
router.post("/api/takelike", (req, res) => {
    var str = '';
    req.on("data", function(chunk) {
        str += chunk;
    })
    req.on("end", function() {
        console.log("点赞了")
        var strJson = JSON.parse(str);
        db.Article.findOneAndUpdate({ aid: strJson.aid }, { $inc: { like_n: 1 } }, function(err, doc) {
            if (err) {
                console.log(err)
            } else {
                res.status(200).end()
            }

        })
    })
})

//阅读
router.post('/api/takeread', (req, res) => {
    var str = '';
    req.on("data", function(chunk) {
        str += chunk;
    })
    req.on("end", function() {
        console.log("阅读了")
        var strJson = JSON.parse(str);
        db.Article.findOneAndUpdate({ aid: strJson.aid }, { $inc: { reads_n: 1 } }, function(err, doc) {
            if (err) {
                console.log(err)
            } else {
                res.status(200).end()
            }

        })
    })
})



module.exports = router