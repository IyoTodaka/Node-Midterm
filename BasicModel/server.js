const { parse } = require('dotenv');
const e = require('express');
const express = require('express');
const mysql = require('mysql');

const app = express();

require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// ログイン状態のflag
app.set('loginFlg',false)

// ログインユーザ
app.set('logedInUser',{
  name : "",
  birthday : new Date(Date.now()),
  profile:""
})

// ログイン処理結果
app.set('loginResult',"")

// DB接続
connection.connect((err) => {
    if (err) {
      console.log('error connecting: ' + err.stack);
      return;
    }
    console.log('success');
  });

  // loginPage
  app.get('/login', (req, res) => {
    console.log("get login");
    if(!app.get('loginResult')){
      res.render('login.ejs',{existMessage:false,message:"''"});
    }else if(app.get('loginResult') == "notExistUser"){
      res.render('login.ejs',{existMessage:true,message:"'user was not found'"});
      
    }else if(app.get('loginResult') == "incorrectPwd"){
      res.render('login.ejs',{existMessage:true,message:"'passsword is incorrect'"});

    }else{
      console.log("something bad");
    }
  })
  app.post('/login', (req, res) => {
    console.log("post request")
    let body = []
    console.log(req);
    req.on('data',(chunk)=>{
      body.push(chunk)
    })
    req.on('end',()=>{
      let parsedBody = Buffer.concat(body).toString()
      parsedBody = decodeURIComponent(parsedBody)

      // formの値を分解する。本当ならパスワードはここで暗号化
      const loginId = parsedBody.split('&')[0].split('=')[1]
      const pwd = parsedBody.split('&')[1].split('=')[1]

      // ここでログインユーザを特定してlogedinUserに値を入れる
      connection.query(
        'SELECT * FROM users WHERE login_name = \'' + loginId+'\';',
        async (error, results) => {
          console.log(results)
          
          if(!(results.length==0)){
            // 本当ならこれも暗号化されてる
            console.log(results[0].password);
            
            if(pwd == results[0].password){
              app.set('loginFlg',true)

              app.set('logedInUser',{
                name : results[0].name,
                birthday : results[0].birthday,
                profile: results[0].profile
              })
            }else{
              app.set('loginResult',"incorrectPwd")
              // res.redirect('/')
            }
          }else{
            
            app.set('loginResult',"notExistUser")
            // res.redirect('/')
          }
        })
          
          
       

      // ここにログイン処理,成功したらloginFlgをtrueにして/にリダイレクト
      res.redirect('/')
    })
  
  })

// rootPage
  app.get('/', (req, res) => {
    if(!app.get('loginFlg')){
     res.redirect('/login')
    }
    connection.query(
      'SELECT * FROM users',
      (error, results) => {
        // console.log(results);
        // birthdayのフォーマットを整えるyyyy-mm-dd
        const birthday = app.get('logedInUser').birthday.getFullYear()+"/"+(app.get('logedInUser').birthday.getMonth()+1)+"/"+app.get('logedInUser').birthday.getDate()
        res.render('home.ejs',{
          userName:app.get('logedInUser').name,
          userBirthday:birthday,
          userProfile:app.get('logedInUser').profile
        });
      }
    );
  });

  app.get('/edit', (req, res) => {
    if(!app.get('loginFlg')){
      res.redirect('/login')
     }
    connection.query(
      'SELECT * FROM users',
      (error, results) => {
        console.log(results);
        res.render('edit.ejs');
      }
    );
  });

  //register page
  app.get('/register', (req, res) => {
    console.log("register");
    connection.query(
      'SELECT * FROM users',
      (error, results) => {
        // console.log(results);
        res.render('register.ejs');
      }
    );
  });

  app.post('/register',(req,res) =>{
    console.log("register post");
    let body = []
    req.on('data',(chunk)=>{
      body.push(chunk)
    })
    req.on('end',()=>{
      let parsedBody = Buffer.concat(body).toString()
      parsedBody = decodeURIComponent(parsedBody)
      parsedBody = parsedBody.replace(/\+/g, ' ')
     
      // requestで飛んできた文字を分解する
      const newUser = [
        parsedBody.split('&')[0].split('=')[1],
        parsedBody.split('&')[1].split('=')[1],
        parsedBody.split('&')[2].split('=')[1],
        parsedBody.split('&')[3].split('=')[1],
        parsedBody.split('&')[4].split('=')[1],
        parsedBody.split('&')[5].split('=')[1],
      ]
      console.log(newUser)
      // usersテーブルへのInsert文
      // idはautoincrement、
      // created_at, updated_atはDB側でDEFAULT値を設定してあるので指定しない
      const query = "INSERT INTO users (name, login_name, password,email,birthday,profile) VALUES (?,?,?,?,?,?);"
      connection.query(query,newUser, (err, result, fields) => {
        if (err) throw err;
        console.log(result)
      });
      res.redirect("/register")
      
    })  
  })


  app.use((req, res, next) => {
    res.send("<h1>Your request was so bad</h1>");
  });

  app.listen(8000);