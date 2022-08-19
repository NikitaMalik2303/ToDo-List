const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

let items= ["work","eat","sleep"];

app.get("/",function(req,res){

  let day = new Date();
  let daytype = day.getDay();
  let kindOfDay = "";

  let options = {
    weekday : "long",
    day : "numeric",
    month : "long"
  }

  kindOfDay = day.toLocaleString("en-US",options);


  res.render("list",{ kindOfDay : kindOfDay , itemsarray : items});

})

app.post("/",function(req,res){
  let item = req.body.newItem;
  items.push(item);

  res.redirect("/");

})

app.listen(3000,function(req,res){
  console.log("server running on port 3000");
})
