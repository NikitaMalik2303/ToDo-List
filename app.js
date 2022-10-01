const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const app = express();
const _ =require("lodash");

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB");


const itemsSchema = {
  name:String
};

const Item = mongoose.model("Item",itemsSchema);

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

const listSchema = {
  name :String,
  items : [itemsSchema]
};

const List = mongoose.model("List",listSchema);


app.get("/home",function(req,res){
  res.render("index");
});

app.get("/today",function(req,res){

  Item.find({},function(err,itemsfound){

    if(itemsfound.length==0){

      Item.insertMany(defaultItems,function(err){
        if(err){
          console.log(err);
        }
        else{
          console.log("successfully saved default items to database");
        }
        res.redirect("/today");
      });

    }else{
        res.render("list",{ listTitle : "Today" , itemsarray : itemsfound});
    }

  });

});

app.get("/:customListName",function(req,res){

  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name:customListName},function(err,foundlist){
    if(!err){
      if(!foundlist){

        const list = new List({
          name:customListName,
          items : defaultItems
        });
        list.save();
        res.redirect("/"+customListName);
      }else{
        res.render("list",{ listTitle:foundlist.name , itemsarray:foundlist.items});
      }
    }else{
      console.log(err);
    }
  });

});

app.post("/",function(req,res){

  const itemName = req.body.newItem;
  const listName = req.body.listValue;

  const item = new Item({
    name:itemName
  });

  if(listName == "Today"){
    item.save();
    res.redirect("/today");
  }else{
    List.findOne({name:listName},function(err,foundList){
      if(!err){
        foundList.items.push(item);
        foundList.save();
        res.redirect("/"+listName);
      }
      else{
        console.log(err);
      }
    })
  }

});

app.post("/delete",function(req,res){

  const deleteItemId = req.body.deletedItem;
  const listTitle = req.body.listValue;

  if(listTitle=="Today"){

      Item.findByIdAndRemove(deleteItemId,function(err){
        if(err){
          console.log(err);
        }
        else{
          console.log("successfully deleted the checked item");
          res.redirect("/today");
        }
      });
  }else{
    List.findOneAndUpdate({name:listTitle},{$pull:{items:{_id:deleteItemId}}},function(err,foundList){
      if(!err){
        res.redirect("/"+listTitle);
      }else{
        console.log(err);
      }
    });
  }


});

app.post("/back",function(req,res){
  res.redirect("/home");
})


app.get("/work",function(req,res){
  res.render("list",{listTitle : "WorkList", itemsarray : workItems});
});

app.listen(3000,function(req,res){
  console.log("server running on port 3000");
});
