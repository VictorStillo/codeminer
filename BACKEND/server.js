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
var Report = require('./models/reports');

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
        Survivor.findById(req.params.survivor_id, function(err, survivor){
            if(err)
                res.send(err)
            res.json(survivor.infection)
        })
    })

    .put(function(req, res){
        Survivor.findById(req.body.reportedId, function(err, survivor){
            if(err)
                res.send(err);
            
            var exists = false;
            survivor.infection.reportersId.forEach(element => {
                if(element == req.body.reporterId)
                    exists = true; 
            })
            
            if(!exists){
                survivor.infection.reportersId.push(req.body.reporterId);
                survivor.infection.reports += 1;
                if(survivor.infection.reports > 2)
                    survivor.infection.isInfected = true;
        
                survivor.save(function(err){
                    if(err)
                        res.send(err)
                    res.json({ message: "Infection updated"})
                })
            }
            else
                res.json({ message: "Infection already reported by this survivor" })
        })
    })

router.route('/survivors/:survivor_id/inventory')

    .get(function(req, res){
        Survivor.findById(req.params.survivor_id, function(err, survivor) {
            if(err)
                res.json(err)
            res.json(survivor.inventory);
        })
    })

    .put(function(req, res) {
        
        Survivor.findById(req.params.survivor_id, function(err, survivor){

            var pickItems = req.body.pickItems;
            var payItems = req.body.payItems;

            pickItems.value = pickItems.water * 4,
                                pickItems.food * 3,
                                pickItems.medication * 2,
                                pickItems.ammunition * 1;
            
            payItems.value = payItems.water * 4,
                                payItems.food * 3,
                                payItems.medication * 2,
                                payItems.ammunition * 1;

            if(pickItems.value == payItems.value){
                if(survivor.inventory.water >= pickItems.water &&
                    survivor.inventory.food >= pickItems.food &&
                    survivor.inventory.medication >= pickItems.medication &&
                    survivor.inventory.ammunition >= pickItems.ammunition &&
                    !survivor.infection.isInfected){
                        survivor.inventory.water += pickItems.water;
                        survivor.inventory.food += pickItems.food;
                        survivor.inventory.medication += pickItems.medication;
                        survivor.inventory.ammunition += pickItems.ammunition;

                        survivor.inventory.water -= payItems.water;
                        survivor.inventory.food -= payItems.food;
                        survivor.inventory.medication -= payItems.medication;
                        survivor.inventory.ammunition -= payItems.ammunition;

                        res.json({ message: "Troca realizada com sucesso!"})

                }
                else{
                    res.json({ message: "Não foi possível completar a troca, items insuficientes ou usuário infectado."})
                }
            }
        })
    })

router.route('/reports')
    .get(function(req, res){
        Survivor.find(function(err, survivors) {
            if (err)
                res.send(err);

            var report = new Report();
            report.nonInfectedSurvivors = 0;
            report.totalSurvivors = 0;
            report.items = {
                water: 0,
                food: 0,
                medication: 0,
                ammunition: 0,
            };
            survivors.forEach(element => {
                report.totalSurvivors += 1;
                if(!element.infection.isInfected){
                    report.nonInfectedSurvivors += 1;
                    report.items.water += element.inventory.water;
                    report.items.food += element.inventory.food;
                    report.items.medication += element.inventory.medication;
                    report.items.ammunition += element.inventory.ammunition;
                }
            })
            report.infectedSurvivors = report.totalSurvivors - report.nonInfectedSurvivors;
            report.totalItems = report.items.water 
                                + report.items.food 
                                + report.items.medication 
                                + report.items.ammunition;

            report.items.water = report.items.water/report.totalItems;
            report.items.food = report.items.food/report.totalItems;
            report.items.medication = report.items.medication/report.totalItems;
            report.items.ammunition = report.items.ammunition/report.totalItems;
            res.json(report);
        });
    })





server.use('/api', router);
server.listen(port);
console.log('Port: ' + port);


