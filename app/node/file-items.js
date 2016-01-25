var fs = require("fs");
var fileName = "./items.json";
var jsonItems = require(fileName);

var Items = {
    getAll: getAll,
    findById: findById,
    findByName: findByName,
    addItem: addItem,
    updateItem: updateItem,
    removeItem: removeItem
};

module.exports.Items = Items;

function getAll(req, res) {
    console.log(jsonItems.length);
    res.send(jsonItems);
}

function findById(req, res) {
    var id = req.params.id;
    var results = [];
    for (var i = 0; i < jsonItems.length; i++) {
        if (jsonItems[i].id == id) {
            results.push(jsonItems[i]);
        }
    }
    return res.send(results);
}

function findByName(req, res) {
    var name = req.params.name;
    var results = [];
    for (var i = 0; i < jsonItems.length; i++) {
        if (jsonItems[i].name.indexOf(name) > -1) {
            results.push(jsonItems[i]);
        }
    }
    return res.send(results);
}

function addItem(req, res) {
    var obj = {
        id: req.body.id,
        pic: req.body.pic,
        name: req.body.name,
        category: req.body.category,
        group: req.body.group,
        description: req.body.description
    };
    jsonItems.push(obj);
    fs.writeFile(fileName, JSON.stringify(jsonItems), "utf8", function () {
    });
    res.send('Ok');
}

function updateItem(req, res) {
    var id = req.body.id;
    var obj = {
        id: req.body.id,
        pic: req.body.pic,
        name: req.body.name,
        category: req.body.category,
        group: req.body.group,
        description: req.body.description
    };
    for (var i = 0; i < jsonItems.length; i++) {
        if (jsonItems[i].id == id) {
            jsonItems.splice(i, 1, obj);
            fs.writeFile(fileName, JSON.stringify(jsonItems), "utf8", function () {
            });
            break;
        }
    }
    res.send('Ok');
}

function removeItem(req, res) {
    var id = req.body.id;
    for (var i = 0; i < jsonItems.length; i++) {
        if (jsonItems[i].id == id) {
            jsonItems.splice(i, 1);
            fs.writeFile(fileName, JSON.stringify(jsonItems), "utf8", function () {
            });
            break;
        }
    }
    res.send('Ok');
}