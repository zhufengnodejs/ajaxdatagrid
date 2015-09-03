module.exports.mustLogin = function (req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.status(500).json({msg: '请登录!'});
    }
}

module.exports.mustNotLogin = function (req, res, next) {
    if (req.session.user) {
        res.status(500).json({msg: '已登录!'});
    } else {
        next();
    }
}

module.exports.mustAdmin = function (req, res, next) {
    if (req.session.user && req.session.user.role > 0) {
        next();
    } else {
        res.status(500).json({msg: '你不是管理员!'});
    }
}