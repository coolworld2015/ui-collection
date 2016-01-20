var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser());

var ItemsModel = require('./mongo').ItemsModel;

var Items = {
    getItems: getItems,
    findItem: findItem,
    findPostItem: findPostItem,
    editItem: editItem,
	editPostItem: editPostItem,
    updateItem: updateItem,
    addItem: addItem,
    saveItem: saveItem,
    removeAllItems: removeAllItems,
    removeItem: removeItem
};

module.exports.Items = Items;

function getItems(req, res) {
    return ItemsModel.find(function (err, items) {
        if (!err) {
            return res.send(items);
        } else {
            res.statusCode = 500;
            return res.send({error: 'Server error'});
        }
    });
}

function findItem(req, res) {
    ItemsModel.findOne({
        id: req.params.id
    }, function (err, item) {
        if (err) {
            res.send({error: err.message});
        }
        console.log(item);
        res.send(item);
    });
}

function findPostItem(req, res) {
    ItemsModel.findOne({
        id: req.body.id
    }, function (err, item) {
        if (err) {
            res.send({error: err.message});
        }
        console.log(item);
        res.send(item);
    });
}

function editItem(req, res) {
    ItemsModel.findOne({
        id: req.params.id
    }, function (err, item) {
        if (err) {
            res.send({error: err.message});
        }

        item.name = req.params.name;

        item.save(function (err) {
            if (!err) {
                res.send(item);
            } else {
                return res.send(err);
            }
        });
    });
}

function editPostItem(req, res) {
    ItemsModel.findOneAndUpdate({
            id: req.body.id
        },
        {$set: {name: req.body.name}},
        function (err, item) {
            if (!err) {
                res.send(item);
            } else {
                res.send({error: err.message});
            }
        });
}

function updateItem(req, res) {
    ItemsModel.findOne({
        id: req.body.id
    }, function (err, item) {
        if (err) {
            res.send({error: err.message});
        }

        item.name = req.body.name;
        item.pic = req.body.pic;
        item.description = req.body.description;

        item.save(function (err) {
            if (!err) {
                res.send(item);
            } else {
                return res.send(err);
            }
        });
    });
}

function addItem(req, res) {
    ItemsModel.create({
            id: req.body.id,
            name: req.body.name,
            pic: req.body.pic,
            description: req.body.description
        },
        function (err, item) {
            if (err) {
                return res.send({error: 'Server error'});
            }
            res.send(item);
        });
}

function saveItem(req, res) {
    console.log(req.body);
    var item = new ItemsModel({
            id: req.body.id,
            name: req.body.name,
            pic: req.body.pic,
            description: req.body.description
    });
    item.save(function (err) {
        if (!err) {
            res.send(item);
        } else {
            return res.send(err);
        }
    });
}

function removeAllItems(req, res, err) {
    ItemsModel.remove({}, function (err) {
    });
    res.send('Collection Items removed');
}

function removeItem(req, res) {
    ItemsModel.remove({
        "id": req.body.id
    }, function () {
        console.log('Item with id: ', req.body.id, ' was removed');
    });
    res.send('Item with id: ' + req.body.id + ' was removed');
}