
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const lodash=require("lodash");
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
 // mongodb+srv://adarshrajyadav68:tesrect7@cluster0.ymcx3jk.mongodb.net/todolistDB;
 const MONGODB_CONNECT_URI="mongodb+srv://adarshrajyadav68:tesrect7@cluster0.ymcx3jk.mongodb.net/todolistDB";
mongoose.connect(process.env.MONGODB_CONNECT_URI);
mongoose.connect("mongodb+srv://adarshrajyadav68:tesrect7@cluster0.ymcx3jk.mongodb.net/todolistDB");

const itemsSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "welcome to our do list"
});

const item2 = new Item({
  name: "click here"
});

const item3 = new Item({
  name: "save"
});

const defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema]
});

const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {
  Item.find().then(function (items) {
    if (items.length === 0) {
      Item.insertMany(defaultItems).then(function () {
        console.log("Successfully entered items.");
        res.redirect("/");
      });
    } else {
      res.render("list", { listTitle: "Today", newListItems: items });
    }
  });
});

app.get("/:customListName", function (req, res) {
  const customListName = lodash.capitalize(req.params.customListName);

  List.findOne({ name: customListName }).then(function (foundList) {
    if (!foundList) {
      const list = new List({
        name: customListName,
        items: defaultItems
      });

      list.save();
      res.redirect("/"+customListName);
      console.log("Created new list");
      res.render("list", { listTitle: list.name, newListItems: list.items });
    } else {
      console.log("Found existing list");
      res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
    }
  }).catch(function (err) {
    console.log(err);
  });
});

app.post("/", function (req, res) {
  const itemname = req.body.newItem;
  const listname=req.body.list;
  const additem = new Item({
    name: itemname
  });
  if(listname==="Today"){
    additem.save();
    res.redirect("/");
  }
  else{
    List.findOne({name:listname}).then(function(founditem){
      founditem.items.push(additem);
      founditem.save();
      res.redirect("/"+listname);
    });
  }
  
  
 
});

app.post("/delete", function (req, res) {
  const checkedId = req.body.checkbox;
  const lc=req.body.listname;
  if(lc==="Today"){
  Item.deleteOne({ _id: checkedId }).then(function () {
    console.log("Deleted item");
    res.redirect("/");
  });
}
else{
  List.findOneAndUpdate({name: lc}, {$pull: {items: {_id: checkedId}}}).then(function (foundlist) {
    if (foundlist) {
      res.redirect("/" + lc);
    }
  });
  
}
});

app.get("/about", function (req, res) {
  res.render("about");
});
app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port " + (process.env.PORT || 3000));
});
