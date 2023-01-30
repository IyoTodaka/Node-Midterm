const db = require("../util/mysql")
const tableName = "users"

module.exports = class User{
    constructor(
        id,
        name,
        email,
        password,
        login_name,
        birthday,
        profile,
        deleted_at,
        ){
            this.id=id
            this.name=name
            this.email=email
            this.password=password
            this.login_name=login_name
            this.birthday=birthday
            this.profile=profile
            this.deleted_at=deleted_at
    }
    save(){
        const sql = "INSERT INTO "+tableName+ " (name, email, password,login_name,birthday,profile) VALUES (?, ?, ?, ?, ?, ?)"
        console.log(sql);
        console.log([this.name, this.email, this.password,this.login_name,this.birthday,this.profile]);
        return db.execute(sql, [this.name, this.email, this.password,this.login_name,this.birthday,this.profile]);
    }

    static find(){
        const sql = "SELECT * FROM " + tableName + "WHERE deleted_at is null"
        return db.query(sql)
    }
    
    static findById(id){
        const sql = "SELECT * FROM " + tableName + " WHERE id = ? AND deleted_at is null"
        return db.execute(sql,[id])
    }
    static findByLoginName(login_name){
        const sql = "SELECT * FROM " + tableName + " WHERE login_name = ? AND deleted_at is null"
        return db.execute(sql,[login_name])
    }
    static updateOne(data){
        const sql =
        "UPDATE "+ tableName +" SET name = ?, email = ?, password = ?, login_name=?,birthday=?,profile=? WHERE (id = ? AND deleted_at is null)";
        const params = [data.name, data.email, data.password, data.login_name,data.birthday,data.profile,data.id];
        return db.execute(sql,params)
    }
    static deleteOne(id) {
        const sql = "UPDATE " + tableName +"deleted_at =? WHERE id = ?";
        const deletedAt = new Date(Date.now())
        return db.execute(sql, [deletedAt,id]);
    }

}