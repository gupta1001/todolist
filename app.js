//jshint esversion:6

const express = require("express");
const https = require("https");
const date = require(__dirname + "/date.js");
console.log(date);

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');

let items = ["Buy Food", "Cook Food", "Eat Food"];
let workItems = [];

app.get("/", function(req, res) {
    const day = date.getDay();
    console.log(day);
    res.render("list", {
        listTitle: day,
        newListItems: items
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
    const item = req.body.newItem;
    if (req.body.list === "Work"){
        workItems.push(item)
        res.redirect("/work")
    }
    else{
        items.push(item);
        res.redirect("/");
    }
});

// app.post("/work", function (req, res) {
//     let workItem = req.body.newItem;
//     workItems.push(workItem);
//     res.redirect("/work");
// });

app.listen(process.env.PORT || 3000, function() {
   console.log("app has started on port 3000"); 
});