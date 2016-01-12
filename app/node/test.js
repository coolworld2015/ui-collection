var fs = require("fs");
var fileName = "./test.json";
var myJson = require(fileName);
 
var Test = {
	getAll: getAll,
    findById: findById,
	findByName: findByName,
	addItem: addItem,
	updateItem: updateItem,	
	removeItem: removeItem
};

module.exports.Test = Test;

function getAll(req, res) {
	console.log(myJson.length);
	res.send(myJson);
};

function findById(req, res) {
	var id = req.params.id;
	var results = [];
	for (var i = 0; i < myJson.length; i++) {
		if (myJson[i].id == id) {
			results.push(myJson[i]);
		}
	}
	return res.send(results);
};

function findByName(req, res) {
	var name = req.params.name;
	var results = [];
	for (var i = 0; i < myJson.length; i++) {
		if (myJson[i].name.indexOf(name) > -1) {
			results.push(myJson[i]);
		}
	}
	return res.send(results);
};

function addItem(req, res) {
	var obj = {
		id:req.body.id,
		pic:req.body.pic,
		name:req.body.name
	}
	myJson.push(obj);
	fs.writeFile(fileName, JSON.stringify(myJson), "utf8", function(){});
	res.send('Ok');
};

function updateItem(req, res) {
	var id = req.body.id;
	var obj = {
		id:req.body.id,
		pic:req.body.pic,
		name:req.body.name
	}
	for (var i = 0; i < myJson.length; i++) {
		if (myJson[i].id == id) {
			myJson.splice(i, 1, obj);
			fs.writeFile(fileName, JSON.stringify(myJson), "utf8", function(){});			
			break;
		}
	}
	res.send('Ok');
};

function removeItem(req, res) {
	var id = req.body.id;
	for (var i = 0; i < myJson.length; i++) {
		if (myJson[i].id == id) {
			myJson.splice(i,1);
			fs.writeFile(fileName, JSON.stringify(myJson), "utf8", function(){});			
			break;
		}
	}
	res.send('Ok');
};