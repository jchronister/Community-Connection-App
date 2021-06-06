"use strict";


const {ObjectID} = require ('mongodb')

const { sendJSON } = require("../middleware/return-object");
const { verifyMongoId } = require('../middleware/verify-data');

const router = require("express")();

// users
// users/:id --get
router.param('id', (req, res, next, id)=> {
                 if(verifyMongoId(req.params, 'id', next)){
                     next();
                 }})
router
    .route("/")
    // .get((req, res) => {
    //           req.db.db.collection('users').find().limit(25).toArray(sendJSON.bind(res))});  //TODO: I want to use a middleware to protect this route only for admin. How to do that?

router
    .route("/:id")

    .get((req, res) => {req.db.db.collection('users').findOne({_id : req.params.id },sendJSON.bind(res))}); //TODO: Why is this line of code displaying all the users instead of one with that given id??

module.exports = router;
