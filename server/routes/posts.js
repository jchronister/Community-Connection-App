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

    .get((req, res) => {

      // Check for Query Parameters
      const items = +req.query.items || 25;
      
      // Convert Page to Number
      const strPage = req.query.page;
      const pageCheck = Number(strPage);
      const page = isNaN(pageCheck) ? 0 : pageCheck;

      // Setup Search Type
      const type = req.query.type;
      if (type === "help-requests") {
        var matchType = {$match: {type : "Help Request"}};
      } else if (type === "service-providers") {
        matchType = {$match: {type : "Service Provider"}};
      }

      // Get Only Last 48 Hour Posts  17,280,000 = (48 * 60 * 60 * 1000)
      const validPostDate = new Date(Date.now() - 172800000);

      // Send Links
      const sendResponse = (err, data) => {

        // Create Query String
        const query = Object.entries(req.query).reduce((a, [key, value], i) => {

          // Get All Query Except Page
          if (key !== "page") {
            a += (i > 0 ? "&" : "") +key + "=" + value;
          }

          return a;
        },"");


        // Setup Return Link Options       
        res.links({
          first: query + '&page=0',
          prev: query + '&page=' + ((page - 1) < 0 ? 0 : page - 1),
          next: query + '&page=' + (page + 1),
        });

        // Needed to Read Header in Browser
        res.set('Access-Control-Expose-Headers', 'Link');
          
        sendJSON.call(res, err, data);

      };

      // Search Query
      let search = [
        {$match: {date: {$gte: validPostDate}, "user.state": req.query.state, "user.city": req.query.city}},
        {$sort: {date: -1}},
        {$skip: page * items},
        {$limit: items},
      ];

      
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