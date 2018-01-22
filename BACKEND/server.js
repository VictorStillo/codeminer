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


var trader1_available = false;
var trader2_available = false;

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

    //Get a survivor's data
    .get(function(req, res){
        Survivor.findById(req.params.survivor_id, function(err, survivor){
            if(err)
                res.send(err)
            res.json(survivor)
        });
    })

    //UPDATE a survivor's location
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

    //DELETE a survivor's data
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
    
    //Verify infection data of a survivor
    .get(function(req, res){
        Survivor.findById(req.params.survivor_id, function(err, survivor){
            if(err)
                res.send(err)
            res.json(survivor.infection)
        })
    })

    //Report and update a survivor infected an
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

//ROUTE FOR survivors/:survivor_id/inventory
router.route('/survivors/:survivor_id/inventory')

    //Return an survivor's inventory
    .get(function(req, res){
        Survivor.findById(req.params.survivor_id, function(err, survivor) {
            if(err)
                res.json(err)
            res.json(survivor.inventory);
        })
    })

    //Trade and update inventory items for a survivor
    .put(function(req, res) {

        Survivor.findById(req.body.survivorId1, function(err, survivor1){

            survivor1.inventory.water = Number(survivor1.inventory.water);
            survivor1.inventory.food = Number(survivor1.inventory.food);
            survivor1.inventory.medication = Number(survivor1.inventory.medication);
            survivor1.inventory.ammunition = Number(survivor1.inventory.ammunition);

            var pickItems = 0;
            var payItems = 0;

            var water1 = Number(req.body.water1);
            var food1 = Number(req.body.food1);
            var medication1 = Number(req.body.medication1);
            var ammunition1 = Number(req.body.ammunition1);

            var water2 = Number(req.body.water2);
            var food2 = Number(req.body.food2);
            var medication2 = Number(req.body.medication2);
            var ammunition2 = Number(req.body.ammunition2);

            pickItems = water2 * 4
                            + food2 * 3
                            + medication2 * 2
                            + ammunition2 * 1;
            
            payItems = water1 * 4
                            + food1 * 3
                            + medication1 * 2
                            + ammunition1 * 1;

            
            if(pickItems == payItems){
                if(survivor1.inventory.water >= water1 &&
                    survivor1.inventory.food >= food1 &&
                    survivor1.inventory.medication >= medication1 &&
                    survivor1.inventory.ammunition >= ammunition1 &&
                    !survivor1.infection.isInfected){
                        survivor1.inventory.water += water2;
                        survivor1.inventory.food += food2;
                        survivor1.inventory.medication += medication2;
                        survivor1.inventory.ammunition += ammunition2;

                        survivor1.inventory.water -= water1;
                        survivor1.inventory.food -= food1;
                        survivor1.inventory.medication -= medication1;
                        survivor1.inventory.ammunition -= ammunition1;

                        trader1_available = true;
                }
                
            }

            Survivor.findById(req.body.survivorId2, function(err, survivor2){

                survivor2.inventory.water = Number(survivor1.inventory.water);
                survivor2.inventory.food = Number(survivor1.inventory.food);
                survivor2.inventory.medication = Number(survivor1.inventory.medication);
                survivor2.inventory.ammunition = Number(survivor1.inventory.ammunition);

                var pickItems = 0;
                var payItems = 0;
    
                var water1 = Number(req.body.water1);
                var food1 = Number(req.body.food1);
                var medication1 = Number(req.body.medication1);
                var ammunition1 = Number(req.body.ammunition1);
    
                var water2 = Number(req.body.water2);
                var food2 = Number(req.body.food2);
                var medication2 = Number(req.body.medication2);
                var ammunition2 = Number(req.body.ammunition2);
    
                pickItems = water1 * 4
                                + food1 * 3
                                + medication1 * 2
                                + ammunition1 * 1;
                
                payItems = water2 * 4
                                + food2 * 3
                                + medication2 * 2
                                + ammunition2 * 1;
    
                
                if(pickItems == payItems){
                    if(survivor2.inventory.water >= water2 &&
                        survivor2.inventory.food >= food2 &&
                        survivor2.inventory.medication >= medication2 &&
                        survivor2.inventory.ammunition >= ammunition2 &&
                        !survivor2.infection.isInfected){
                            survivor2.inventory.water += water1;
                            survivor2.inventory.food += food1;
                            survivor2.inventory.medication += medication1;
                            survivor2.inventory.ammunition += ammunition1;
    
                            survivor2.inventory.water -= water2;
                            survivor2.inventory.food -= food2;
                            survivor2.inventory.medication -= medication2;
                            survivor2.inventory.ammunition -= ammunition2;
    
                            trader2_available = true;
                    }
                }
                if(trader1_available && trader2_available){
                    survivor1.save(function(err){
                        if(err)
                            res.send(err)
                    })

                    survivor2.save(function(err){
                        if(err)
                            res.send(err)
                    })

                    res.json("Troca Realizada com sucesso!");
                }
                else{
                    res.json("Não foi possível realizar a troca!");
                }
                
            })
            
        })
        
        
    })

//ROUTE FOR /reports
router.route('/reports')

    //Generate reports
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


