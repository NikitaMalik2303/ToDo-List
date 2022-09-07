const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const app = express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/toDoListDB",{useNewUrlParser:"true"});

const itemsSchema = {
  name:String
};

const item = mongoose.model("Item",itemsSchema);

const item1 = new Item({
  name:"welcome to the to-do list"
});

const item2 = new Item({
  name:"click + to add a new item"
});

const item3 = new Item({
  name:"<-- click to delete an item"
});

const defaultItems = [item1,item2,item3];

toDoListDB.insertMany(defaultItems,function(err){
  if(err){
    console.log(err);
  }else{
    console.log("successfully saved default items to database");
  }
});

app.get("/",function(req,res){


  res.render("list",{ listTitle : listTitle , itemsarray : items});

});

app.post("/",function(req,res){

  let item = req.body.newItem;
  console.log(req.body);
  if(req.body.listValue === "WorkList"){
    workItems.push(item);
    res.redirect("/work");
  }
  else{
    items.push(item);
    res.redirect("/");
  }

});

app.get("/work",function(req,res){
  res.render("list",{listTitle : "WorkList", itemsarray : workItems});
});

app.listen(3000,function(req,res){
  console.log("server running on port 3000");
});
