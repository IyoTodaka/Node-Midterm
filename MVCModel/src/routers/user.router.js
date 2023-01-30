const router = require("express").Router()

const {
    getRegister,
    postRegister,
    getLogin,
    postLogin,
    checksession,
    getLogout
} = require("../controller/user.controller.js")

router.get("/register",getRegister)
router.post("/register",postRegister)
router.get("/login",getLogin)
router.post("/login",postLogin)
router.get("/checksession",checksession)
router.get("/logout",getLogout)

module.exports = router