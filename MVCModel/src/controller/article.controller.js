const Article = require("../model/article.model")
const User = require("../model/user.model")

exports.getArticles = (req,res)=>{
    console.log("blog home だよ")
    // console.log(req.session)

    // User.findById(req.session.userid).then(([users])=>{
    //     const loginUser = users[0]
        Article.find()
        .then(([rows])=>{
            res.render("home",{rows})
        })
    // })
}

exports.getEditArticle = (req,res)=>{
    const editId = req.params.id
 
    Article.findById(editId)
    .then(([rows])=>{
        res.render("edit",{article:rows[0]})
    })
}
exports.postEditArticle = (req,res)=>{
    const editId = req.params.id
    const {article_title,article_body} = req.body
    const auther_name = "john"
    const data = {auther_name:auther_name,article_title:article_title,article_body:article_body,id:editId }
    Article.updateOne(data)


    
    res.redirect("/blog/home")
    
    
}
exports.getCreateArticle = (req,res)=>{
    const newArticle = new Article()
    res.render("create",{article:newArticle})

}
exports.postCreateArticle = (req,res)=>{
    const {article_title,article_body} = req.body
    const auther_name = "john"
    const newArticle = new Article(null,auther_name,article_title,article_body,null,null)
    newArticle.save()
    res.redirect("/blog/home")

}
exports.deleteArticle = (req,res)=>{
    console.log("deleteきたぞ");
    const deleteId = req.params.id
    Article.deleteOne(deleteId)
    res.redirect("/blog/home")
}

