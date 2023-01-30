const User = require("../model/user.model")
const Session = require("../model/session.model")
const crypto = require("crypto")
const { strict } = require("assert")

let message = ""

exports.getRegister= (req,res)=>{
    const newUser = new User()
    res.render("register",{user:newUser})
}
exports.postRegister= (req,res)=>{
    const {name, email, password,login_name,birthday,profile} = req.body
    const newUser = new User("",name,email,password,login_name,birthday,profile,"")
    newUser.save()
    res.redirect("/")
    
}

exports.postLogin = (req,res)=>{
    const {login_name,password} = req.body  
    User.findByLoginName(login_name)
    .then(([rows])=>{
        
        if(rows.length===0){
            console.log("誰もいなかった");
            message="<script>alert('user not found')</script>"
            res.redirect("/user/login")
        }else if (rows[0].password == password){
            // ログイン成功
            // message = ""
            // console.log(req.session);
            let session = req.session
            session.user_id = rows[0].id
            // console.log(session)

            res.redirect("/blog/home")
        }else{
            message="<script>alert('incorrect password')</script>"
            res.redirect("/user/login")
        }
    })
    .catch((err) => console.error(err.message));
    
}
exports.getLogin = (req,res)=>{
    console.log("get login");
    res.render("login",{message:message})
}

exports.checksession = (req,res)=>{
    console.log("checksession呼ばれた");
    console.log(req.session);


    Session.findByLoginUserIdAndSessionId(req.cookies.login_user_id,req.cookies.session_id)
    .then(([row])=>{
        if(row.length==0){
            message = "<script>alert('your session info is MEGA BAD')</script>"
            req.session.destroy();
            res.render("login",{message:message})
        }else{
            res.redirect("/blog/home")
        }
    })
    
}
exports.getLogout = (req,res)=>{
    req.session.destroy()
    res.redirect("/")
}