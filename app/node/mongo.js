var mongoose = require('mongoose');

//mongoose.connect('mongodb://localhost:27017/warehouse');
//mongoose.connect('mongodb://admin:admin@ds053728.mongolab.com:53728/warehouse');

mongoose.connect('mongodb://admin:admin@ds047355.mongolab.com:47355/collection');

var db = mongoose.connection;

db.on('error', function (err) {
    console.log('Error from mongoDB: ' + err.message);
});

db.once('open', function callback() {
    console.log('Connected to mongoDB');
});

//---------------------------------------------------------------------------------------------
var Schema = mongoose.Schema;
var Clients = new Schema({
    id: {type: String, required: true},
    name: {type: String, required: true},
    pic: {type: String, required: true},
    description: {type: String, required: true}
});

var ClientsModel = mongoose.model('Clients', Clients);
module.exports.ClientsModel = ClientsModel;