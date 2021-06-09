"use strict";


const createHttpError = require("http-errors");
const { isValidUser } = require("../middleware/authentication");
const { sendJSON, getReturnObject } = require("../middleware/return-object");
const { getMongoId, verifyMongoId } = require("../middleware/verify-data");
const router = require("express")();


// Verify Mongo Id & Create ObjectID
router.param('id', (req, res, next)=> {
    if(verifyMongoId(req.params, 'id', next)){
        next();
    }
});


// /posts
router.route("/")

    // Get Posts
    .get((req, res, next) => {

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
      } else if (type === "notifications") {

        // Convert to MongoID Return on Error
        let exit = false;
        const ids = req.query.ids.split("<>").map(n=>{
          
          const id = getMongoId(n, next);

          if (id) {
            return id;
          } else {
            exit = true;
            return 0;
          }
          
        });

        if (exit) return;
        matchType = {$match: {_id : { $in: ids }}};

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

      // Overwrite for New notifications
      if (type === "notifications") search = [matchType];

      req.db.db.collection("posts").aggregate(search).toArray(sendResponse);

    })
    
    // Insert Post
    .post(isValidUser, verifyPostData, (req, res) => {
      req.db.db.collection("posts").insertOne(req.body, sendJSON.bind(res));
    });




//insert comment in post with an :id
router.route("/:id/comments")

    .post((req, res) => {
      
      // Set Date
      req.body.date = new Date();

        req.db.db.collection("posts").updateOne(
            { _id : req.params.id }, 
            { $push: { comments: req.body } },
            sendJSON.bind(res)
        );
    });


router.route("/changes")

    // Get Changes to Users Post or Posts They Commented On
    .get( isValidUser, (req, res, next) => {

      // Get Last Change Date - Default to 0
      const dateMS = Number(req.query.datems) || 0;


      // Get Mondo Id
      const _id = getMongoId(req.db.user._id, next);

      // const _id = getMongoId("6098368d6bf8f3231048f652", next); // Testing
      if (!_id) return;

      const query = [

        // Match User for Created Posts and Comments
        {$match: {$or: [{"user._id": _id}, {"comments.user._id": _id}]}},

        // Just Deal with the Comments
        {$project: {description:1, comments:1}},

        // Splitout Comments
        {$unwind: "$comments"},

        // Filter Out Users Name (He knows what he posted) & Old Changes <= Date Query Parameter
        {$match: {"comments.user._id": {$ne: _id}, "comments.date": {$gt: new Date(dateMS)}}},

        // Return Post._id and Last Comment Date
        {$project: {changeDate: "$comments.date", type: "change"}}
                      
      ];
      
      // Browser/Node Time Diff?
      req.db.db.collection("posts").aggregate(query)
        // .toArray(sendJSON.bind(res));
        .toArray( (err, data) => {

          const retrn = getReturnObject(err, data);

          retrn.data = { checkDate: new Date(), data: retrn.data };

          res.json(retrn);

        });

    });

module.exports = router;


// Verify Post Data and Creates Insert Object
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