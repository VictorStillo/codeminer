const bodyParser = require('body-parser');
const express = require('express');
const server = express();

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

var port = process.env.PORT || 8080;

//Connection with MongoDB
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/codeminer');
var db = mongoose.connection;


//Routes for our API
var router = express.Router();

//Routes that end in survivors
var Survivor = require('./models/survivor');
var Inventory = require('./models/inventory');
var Infection = require('./models/infection');

router.route('/survivors')

    //POST A SURVIVOR
    .post(function(req, res){
        var survivor = new Survivor();
        survivor.name = req.body.name;
        survivor.age = req.body.age;
        survivor.gender = req.body.gender;
        survivor.latitude = req.body.latitude;
        survivor.longitude = req.body.longitude;

        survivor.inventory = {
            water: req.body.water,
            food: req.body.food,
            medication: req.body.medication,
            ammunition: req.body.ammunition,
        };

        survivor.infection = {
            isInfected: false,
            reports: 0,
        }

        survivor.save(function(err) {
            if(err)
                res.send(err);

            res.json({ message: 'Survivor created!' });
        });
    })

    //GET ALL SURVIVORS
    .get(function(req, res) {
        Survivor.find(function(err, survivors) {
            if (err)
                res.send(err);

            res.json(survivors);
        });
    })

//Routes that ends in /survivors/:survivor_id
router.route('/survivors/:survivor_id')

    .get(function(req, res){
        Survivor.findById(req.params.survivor_id, function(err, survivor){
            if(err)
                res.send(err)
            res.json(survivor)
        });
    })

    .put(function(req, res){
        Survivor.findById(req.params.survivor_id, function(err, survivor) {

            if (err)
                res.send(err);

            //UPDATE SURVIVOR
            survivor.latitude = req.body.latitude;  
            survivor.longitude = req.body.longitude;

            
            // SAVE SURVIVOR
            survivor.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'Survivor updated!' });
            });
        })
    })

    .delete(function(req, res) {
        Survivor.remove({
            _id: req.params.survivor_id
        }, function(err, survivor) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    })


//ROUTE FOR survivors/:survivor_id/infection
router.route('/survivors/:survivor_id/infection')
    
    .get(function(req, res){
        Infection.find(function(err, infection) {
            if (err)
                res.send(err);

            res.json(infection);
        });
    })




server.use('/api', router);
server.listen(port);
console.log('Port: ' + port);


