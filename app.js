//jshint esversion:6

const express = require("express");
const https = require("https");
const mongoose = require("mongoose");
const _ = require("lodash");
require("dotenv").config();

//const date = require(__dirname + "/date.js");

//mongo db connection
//connectionString = process.env.CONNECTION_STRING;
mongoose.connect("mongodb+srv://admin-prankur:mongoD16826@cluster0.vkl3v.mongodb.net/todolistDB");

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
                console.log(foundItems);
            }
            else{
                res.render("list", {listTitle: "Today", newListItems: foundItems});
            }
    });
});

// app.get("/work", function (req, res) {
//     res.render("list", {
//         listTitle: "Work Items",
//         newListItems: workItems
//     });
// })

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
        setTimeout(() => {
            res.redirect("/");
        }, "100");
    }
    else{
        List.find({name: listTitle}, function (err, foundList) { 
            if (!err){
                console.log(foundList[0].items);
                foundList[0].items.push(item);
                foundList[0].save();
                setTimeout(() => {
                    res.redirect(`/${listTitle}`);
                }, "100");

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
    else{
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: itemId}}}, function (err, foundList) { 
            if (!err){
                console.log("Successfully deleted the item!");
                res.redirect(`/${listName}`);                    
            }
        });
    }
    
});

app.get("/:todolistName", function (req, res) {
    const customListTitle = _.capitalize(req.params.todolistName);
    //console.log("custom list requested ", customListTitle);
    // console.log(customListTitle);
    // if(customListTitle === "Favicon.ico"){
    //     res.redirect("/")
    // }
    // else{

    List.findOne({name: customListTitle}, function (err, foundList) { 
        //console.log(foundList + " array of the list");
        if (!err){
            if(!foundList){
                const list = new List({
                    name: customListTitle,
                    items: defaultItems
                });
                list.save();
                redirectPostUpdate();
            }
            else if(foundList.items.length === 0){
                foundList.items = defaultItems;
                foundList.save();
                redirectPostUpdate();
            }
            else{
                res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
            }
        }
    });

    const redirectPostUpdate = function(){
        setTimeout(() => {
            res.redirect(`/${customListTitle}`);
        }, "100");
    }
    //}   
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

let port = process.env.PORT
if (port == null || port == ""){
    port = 3000;
}

app.listen(port, function() {
   console.log("app has started on port: " +  port); 
});