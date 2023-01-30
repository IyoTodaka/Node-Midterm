const router = require("express").Router()

const {
    getArticles,
    getEditArticle,
    postEditArticle,
    getCreateArticle,
    postCreateArticle,
    deleteArticle
} = require("../controller/article.controller.js")

router.get("/home",getArticles)
router.get("/edit/:id",getEditArticle)
router.post("/edit/:id",postEditArticle)
router.get("/create",getCreateArticle)
router.post("/create",postCreateArticle)
router.post("/delete/:id",deleteArticle)


module.exports = router