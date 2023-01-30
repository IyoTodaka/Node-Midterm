const db = require("../util/mysql")
const tableName = "sessions"

module.exports = class User{
    constructor(
        login_user_id,
        session_id
    ){
        this.login_user_id=login_user_id
        this.session_id=session_id
    }
    save(){
        const expiredAt= new Date(Date.now()+(24*60*60*1000))
        const sql = "INSERT INTO "+tableName+ " (login_user_id,session_id,expired_at) VALUES (?, ?, ?)"
        return db.execute(sql, [this.login_user_id,this.session_id,expiredAt]);
    }
    static findByLoginUserIdAndSessionId(login_user_id,session_id){
        const now = new Date(Date.now())
        const sql = "SELECT * FROM " + tableName + " WHERE login_user_id = ? AND session_id =? AND expired_at > ?"
        return db.execute(sql,[login_user_id,session_id,now])
    }
    
    static deleteOne(login_user_id) {
        const sql = "DELETE FROM " + tableName +" WHERE login_user_id = ?";
        const deletedAt = new Date(Date.now())
        return db.execute(sql, [login_user_id]);
    }

}