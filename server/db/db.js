const mongoose = require('mongoose')
const Schema = mongoose.Schema
const data = require("./data.json")
const sha1 = require("sha1")
const rand = require('csprng')
const Sequence = require('./sequence')

const ArticleSchema = new Schema({
    aid: {
        type: Number,
        index: { unique: true } //唯一标识
    },
    title: String, //标题
    content: String, //文章
    html_content: String, //文章（html格式）
    date_detail: String,
    date: Number, //发布详情时间
    comment_n: Number, //评论数
    like_n: Number, //点赞数
    reads_n: Number, //阅读量
    tags: [String] //标签
}, { versionKey: false })

const CommentSchema = new Schema({
    order: Number,
    name: String,
    address: String,
    content: String,
    articleId: Number,
    date: Date,
    replyBox: Array // { reply_order: Number, reply_creatAt: Date, reply_name: String, reply_text: String, told: String,reply_address:String }
}, { versionKey: false })

const UserSchema = new Schema({
    name: String,
    password: String,
    salt: String //使用csprng随机生成盐(用于加密)
}, { versionKey: false })

const MessageSchema = new Schema({
    name: String,
    address: String,
    content: String,
    messageId: { type: Number, default: 6666 },
    date: Date,
}, { versionKey: false })

const ArchivesSchema = new Schema({
    date: Number, //发布详情时间
    data: [{
        aid: Number,
        title: String,
        creatAt: String
    }], //该年份的数据
}, { versionKey: false })

//生成从0开始自增长的文章aid
ArticleSchema.pre('save', function(next) {
    var self = this;
    if (self.isNew) {
        Sequence.increment('Article', function(err, result) {
            if (err) {
                throw err;
            };
            self.aid = result.value.next;
            next();
        })
    } else {
        next()
    }
})

const Models = {
    Article: mongoose.model('Article', ArticleSchema),
    Comment: mongoose.model('Comment', CommentSchema),
    Message: mongoose.model('Message', MessageSchema),
    User: mongoose.model('User', UserSchema),
    Archives: mongoose.model('Archives', ArchivesSchema)
}

//初始化数据
const initialize = () => {
    console.log('beginning to initialize data...')
    Models.User.find({}, (err, doc) => {
        if (err) {
            console.log(err)
            console.log('initialize failed')
        } else if (!doc.length) {
            const salt = rand(160, 36)
                //第一次创建站长账户
            new Models['User']({
                name: "admin",
                password: sha1('aa123456' + salt),
                salt: salt
            }).save();
            Promise.all(data.map((item) => { new Models['Article'](item).save() }))
                .then(() => { console.log('initialize successfully') })
                .catch(() => { console.log('initialize failed') })
                // console.log('Initialize successfully')
        } else {
            console.log('Loaded successfully')
        }
    })
}

mongoose.connect('mongodb://127.0.0.1/blog')

const db = mongoose.connection

db.on('error', console.error.bind(console, 'Database connection error.'));
db.once('open', () => {
    console.log('The database has connected.')
    initialize()
});

module.exports = Models