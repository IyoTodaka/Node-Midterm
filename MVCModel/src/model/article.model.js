const db = require("../util/mysql")
const tableName = "articles"


module.exports = class Article{
    constructor(
        id,
        auther_name,
        article_title,
        article_body,
        created_at,
        deleted_at
        ){
            this.id = id,
            this.auther_name=auther_name,
            this.article_title=article_title,
            this.article_body=article_body,
            this.created_at=created_at,
            this.deleted_at=deleted_at
    }

    save(){
        const sql = "INSERT INTO "+tableName+ " (auther_name, article_title, article_body) VALUES (?, ?, ?)"
        return db.execute(sql, [this.auther_name, this.article_title, this.article_body]);
    }

    static find(){
        const sql = "SELECT * FROM " + tableName + " WHERE deleted_at is null"
        return db.query(sql)
    }
    
    static findById(id){
        const sql = "SELECT * FROM " + tableName + " WHERE id = ? AND deleted_at is null"
        return db.execute(sql,[id])
    }
    
    static updateOne(data){
        const sql =
        "UPDATE "+ tableName +" SET auther_name = ?, article_title = ?, article_body = ? WHERE (id = ? AND deleted_at is null)";
        const params = [data.auther_name, data.article_title, data.article_body,data.id];
        return db.execute(sql,params)
    }
    static deleteOne(id) {
        const sql = "UPDATE " + tableName +" SET deleted_at = ? WHERE id = ?";
        const deletedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')

        console.log(id);
        console.log(deletedAt);
        return db.execute(sql, [deletedAt,id]);
    }

}