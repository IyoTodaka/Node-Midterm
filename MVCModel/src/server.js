// .envファイルの読み込み
require('dotenv').config();

// 外部モジュールの読み込み
const express = require("express");
const path = require("path");
const methodOverride = require('method-override');

// DB接続（プロミス型のセッション情報）を取得
const dbConnection = require("./util/mysql");





const app = express();

// セッション管理
const sessions = require("express-session")

const oneDay= 24 * 60 * 60 * 1000;
app.use(
    sessions({
      secret: "aaa",
      saveUninitialized: true,
      resave: false,
      cookie: { 
        maxAge: oneDay ,
        sameSite: 'None'
      }
    })
  );

const {
  checksession
  } = require("./controller/user.controller.js")
// URLエンコードとかごにょごにょ
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'))

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", "src/views");

// routerのインポート
const userRouter = require("./routers/user.router")
const articleRouter = require("./routers/article.router")

app.use("/user", userRouter)
app.use("/blog", articleRouter)

const cookieParser = require('cookie-parser')
app.use(cookieParser())



app.get("/", (req, res) => {
  if (req.session.user_id) {
    checksession(req,res)
  } else {
    res.redirect("/user/login");
  }
});


const PORT = process.env.PORT || 8000;
app.listen(PORT, async () => {
    console.log("Server started !");
  
    const [data] = await dbConnection.query("SELECT 5") // { "1": 1 }
    if(data) console.log("Successful connection to the MySQL database!")
    
  });