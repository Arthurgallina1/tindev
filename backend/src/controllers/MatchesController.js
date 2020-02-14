//Route->Controller
const axios = require('axios');
const Dev = require('../models/Dev')
// Controller should've at most the 5 methods: INDEX (listar), SHOW, STORE, UPDATE & DELETE
module.exports = {

    async index(req, res) {
        const { user } = req.params;

        const loggedDev = await Dev.findById(user);
        const users = await Dev.find({
           $and: [ //and on 3 conditions 
               { _id: { $ne: user } }, //id not equal user id
               { _id: { $in: loggedDev.matches }}
            ] //id not in liked users           ] 
        })

        return res.json(users)
    }
};