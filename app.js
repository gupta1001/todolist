//jshint esversion:6

const express = require("express");
const https = require("https");
const mongoose = require("mongoose");

//const date = require(__dirname + "/date.js");

//mongo db connection
mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemsSchema = {
    name: "String"
}

const listSchema = {
    name: "String",
    items: [itemsSchema]
}

const List = mongoose.model("List", listSchema);
const Item = mongoose.model("Item", itemsSchema); 

const item1 = new Item({
    name: "Welcome to todolist!"
});

const item2 = new Item({
    name: "Hit the + button to add new item"
});

const item3 = new Item({
    name: "<--- Hit this to delete an item"
});

const defaultItems = [item1, item2, item3];


const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');

// let items = ["Buy Food", "Cook Food", "Eat Food"];
// let workItems = [];


app.get("/", function(req, res) {

    //const day = date.getDay();
    //console.log(day);
    Item.find(function (err, foundItems) {
            if (foundItems.length === 0){
                Item.insertMany(defaultItems, function(err){
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log("Successfully added default items to DB")
                }});
                res.redirect("/");
            }
            else{
                res.render("list", {listTitle: "Today", newListItems: foundItems});
            }
    });
});

app.get("/work", function (req, res) {
    res.render("list", {
        listTitle: "Work Items",
        newListItems: workItems
    });
})

app.get("/about", function (req, res) {
    res.render("about");
})

app.post("/", function (req, res) {
    const itemName = req.body.newItem;
    const listTitle = req.body.list;

    const item = new Item({
        name: itemName
    });

    if (listTitle === "Today"){
        item.save();
        res.redirect("/");
    }
    else{
        List.find({name: listTitle}, function (err, foundList) { 
            if (!err){
                console.log(foundList[0].items);
                foundList[0].items.push(item);
                foundList[0].save();
                res.redirect(`/${listTitle}`);
            }
        });
    }
});


//deleting an item from mongo db
app.post("/delete", function (req, res) {
    console.log(req.body);
    const itemId = req.body.checkbox;
    const listName = req.body.listTitle;
    if(listName === "Today"){
        Item.findByIdAndRemove(itemId, function(err){
            if(!err){
                console.log("Successfully deleted the item!");
                res.redirect("/");
            }
        });
    }
    // else{
    //     listName.findByIdAndRemove
    // }
    
});

app.get("/:todolistName", function (req, res) {
    const customListTitle = req.params.todolistName.toLowerCase();
    //console.log("custom list requested ", customListTitle);
    List.find({name: customListTitle}, function (err, foundList) { 
        if (!err){
            if(foundList.length === 0){
                const list = new List({
                    name: customListTitle,
                    items: defaultItems
                });
                list.save();
                res.redirect(`/${customListTitle}`);
            }
            else{
                res.render("list", {listTitle: foundList[0].name, newListItems: foundList[0].items});
            }
        }
    });
    
});

app.post("/:todolistName", function (req, res) {
    const itemName = req.body.newItem;
    const item = new Item({
        name: itemName
    });
    item.save();
    res.redirect("/");
});

// app.post("/work", function (req, res) {
//     let workItem = req.body.newItem;
//     workItems.push(workItem);
//     res.redirect("/work");
// });

app.listen(process.env.PORT || 3000, function() {
   console.log("app has started on port 3000"); 
});