var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser({limit: '50mb'}));

app.listen(process.env.PORT || 3000, function () {
    console.log('Server is running on 3000');
});

app.get('/', function (req, res) {
	//res.sendFile(__dirname + '/build/index.html');
    res.send('It is just API Server...');
});

app.use(express.static(__dirname + '/'));
//app.use(express.static(__dirname + '/build'));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

//------------------------------------------------------------------------
var fileClients = require('./file-clients').Clients;

app.get('/file/api/clients/get', fileClients.getAll); 
app.get('/file/api/clients/findId/:id', fileClients.findById);
app.get('/file/api/clients/findName/:name', fileClients.findByName);
app.post('/file/api/clients/add', fileClients.addItem);
app.post('/file/api/clients/delete', fileClients.removeItem);
app.post('/file/api/clients/update', fileClients.updateItem);

//------------------------------------------------------------------------
var mongoClients = require('./mongo-clients').Clients;

app.get('/api/clients/get', mongoClients.getClients);

app.get('/api/clients/find/:id', mongoClients.findClient);
app.post('/api/clients/find', mongoClients.findPostClient);

app.get('/api/clients/edit/:id/:name', mongoClients.editClient);
app.post('/api/clients/edit/', mongoClients.editPostClient);
app.post('/api/clients/update', mongoClients.updateClient);

app.post('/api/clients/add', mongoClients.addClient);
app.post('/api/clients/save', mongoClients.saveClient);

app.get('/api/clients/drop', mongoClients.removeAllClients);
app.post('/api/clients/drop', mongoClients.removeAllClients);
app.post('/api/clients/delete', mongoClients.removeClient);