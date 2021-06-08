"use strict";

const createHttpError = require("http-errors");
const { isValidUser } = require("../middleware/authentication");
const { sendJSON } = require("../middleware/return-object");
const { verifyMongoId } = require("../middleware/verify-data");
const router = require("express")();

// posts

//posts/help_requests -- post//!Done
//posts/help_requests --get  --sort by date //!Done

//posts/service_providers --post//!Done
//posts/service_providers --get  --sort by date//!Done

//posts/:_id/comment --post //!Done

//posts --get --sort by date //!Done

//posts all posts sort by date

// Verify Mongo Id & Create ObjectID
router.param('id', (req, res, next)=> {
    if(verifyMongoId(req.params, 'id', next)){
        next();
    }
});

// /posts
router.route("/")

    .get((req, res, next) => {

      // Check for Query Parameters
      const page = req.query.page;
      const key = req.query.key;
      const items = +req.query.items || 25;
      const type = req.query.type;
      const state = req.query.state;
      const city = req.query.city;

      // Setup Search Type
      if (type === "help-requests") {
        var matchType = {$match: {type : "Help Request"}};
      } else if (type === "service-providers") {
        matchType = {$match: {type : "Service Provider"}};
      }

      // Change Key to Date if Needed
      if (key) {
        const numKey = Number(key);
        if (isNaN(numKey)) {
          next(createHttpError(400, "Invalid Key, Must be a Number"));
        } else {
          var keyDate = new Date(numKey);
        }
      }

      // Get Only Last 48 Hour Posts  17,280,000 = (48 * 60 * 60 * 1000)
      const validPostDate = new Date(Date.now() - 172800000);

      // Send Links
      const sendResponse = (err, data) => {

        if (data && data.length) {  
          // Setup Return Link Options       
          res.links({
            first: 'page=first&key=0',
            prev: 'page=prev&key=' + Date.parse(data[0].date),
            next: 'page=next&key=' + Date.parse(data[data.length - 1].date),
            last: 'page=last&key=0'
          });

          res.set('Access-Control-Expose-Headers', 'Link');
          
        }

        sendJSON.call(res, err, data);

      };


      switch (page) {

        case "prev":
          var search = [
            {$match: {date: {$gt: keyDate}}},
            {$sort: {date: 1}},
            {$limit: items},
            {$sort: {date: -1}}
          ];
          break;

        case "next":
          search = [
            {$match: {"date": {$lt: keyDate}}},
            {$sort: {"date": -1}},
            {$limit: items},
          ];
          break;

        case "last":
          search = [
            {$sort: {date: 1}},
            {$limit: items},
            {$sort: {date: -1}}
          ];
          break;

        default:
          search = [
            {$sort: {date: -1}},
            {$limit: items},
          ];

      }

      // Add 48 Hours
        search = [{$match: {date: {$gte: validPostDate}, "user.state": state, "user.city": city}}, ...search];

      // Add Type of Match
      if (matchType) search = [matchType, ...search];

      req.db.db.collection("posts").aggregate(search).toArray(sendResponse);

    })
    
    .post(isValidUser, verifyPostData, (req, res) => {
      req.db.db.collection("posts").insertOne(req.body, sendJSON.bind(res));
    });




//insert comment in post with an :id
router.route("/:id/comments")

    .post((req, res) => {
        req.db.db.collection("posts").updateOne(
            { _id : req.params.id }, 
            { $push: { comments: req.body } },
            sendJSON.bind(res)
        );
    });

module.exports = router;



function verifyPostData (req, res, next) {

  const type = req.body.type;
  const description = req.body.description;

  // Verify Type of Request
  if (type !== "Help Request" && type !== "Service Provider") {
    next(createHttpError(400, "Invalid Type"));
  }
 
  // Verify Description
  if (!description) {
    next(createHttpError(400, "Invalid Description"));
  }

  // Get User Info
  const {_id, username, state, phone, name, email, city, address, zip} = req.db.user;

  // Create Data Object
  req.body = {
    type,
    description,
    user: {_id, username, state, phone, name, email, city, address, zip},
    date: new Date(),
    comments: [],
    completed: false
  };

  next();
}