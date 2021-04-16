const jwt = require('jsonwebtoken')


var tokenObj = {
    createToken: function(id, name) {
        var payload = { id: id, name: name };
        var secretOrPrivateKey = 'Warmingup666'; //密钥（私钥）
        var token = jwt.sign(payload, secretOrPrivateKey, { expiresIn: '7d' }); //生成token
        return token;
    },
    checkToken: function(token, res) {
        var secretOrPrivateKey = 'Warmingup666';
        jwt.verify(token, secretOrPrivateKey, function(err, decode) { //检验token
            if (err) {
                res.status(401).end()
            } else {
                res.status(200).end("检验成功")
            }
        })
    }
}
module.exports = tokenObj