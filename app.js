const express = require('express')
const app = express()
const path = require('path')
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser')
const config = require('config')
const mysql = require('mysql');

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')
app.use(express.static(path.join(__dirname, 'static')))

// before you use this, make sure to update the default.json file in /config
const conn = mysql.createConnection({
  host: config.get('db.host'),
  database: config.get('db.database'),
  user: config.get('db.user'),
  password: config.get('db.password')
})

app.post("/", function(req,res,next) {
  const todo_item = req.body.todo
  const id = req.body.id


  if (id && active) {
    const sql = `
      UPDATE todo_items
      SET active = null, complete = true, delete = null
      WHERE id = ?
    `
    conn.query(sql, [id], function(err, results, fields){
      if (!err) {
        res.redirect("/")
      } else {
        res.send("oh no!")
      }
    })
  }
    else if (id && complete) {
      const sql = `
        UPDATE todo_items
        SET active = null, complete = null, delete = true
        WHERE id = ?
      `
      conn.query(sql, [id], function(err, results, fields){
        if (!err) {
          res.redirect("/")
        } else {
          res.send("oh my!")
        }
      })

  } else {
    const sql = `
      INSERT INTO todo_items (todo_item, active)
      VALUES (?, true)
    `

    conn.query(sql, [todo_item], function(err, results, fields) {
      if (!err) {
        res.redirect("/")
      } else {
        console.log(err)
        res.send("error")
      }
    })
  }
})

app.get("/", function(req, res, next){
  res.render("index", {appType:"Express"})
})

app.listen(3000, function(){
  console.log("App running on port 3000")
})
