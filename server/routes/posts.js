"use strict";

const createHttpError = require("http-errors");
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
      const items = req.query.items || 25;
      const type = req.query.type;

      // Change Key to Date if Needed
      if (key) {
        const numKey = Number(key);
        if (isNaN(numKey)) {
          next(createHttpError(400, "Invalid Key, Must be a Number"));
        } else {
          var keyDate = new Date(numKey);
        }
      }

      // Send Links
      const sendResponse = (err, data) => {

        if (data) {  
          // Setup Return Link Options       
          res.links({
            first: '?page=first&key=0',
            prev: '?page=prev&key=' + Date.parse(data[0].date),
            next: '?page=next&key=' + Date.parse(data[data.length - 1].date),
            last: '?page=last&key=0'
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
            {"$match": {"date": {$lt: keyDate}}},
            {"$sort": {"date": -1}},
            {"$limit": items},
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

      // Query
      req.db.db.collection("posts").aggregate(search).toArray(sendResponse);

    })
    
    .post((req, res) => {});


//sort help_requests by date
router.route("/help_requests")
    .get((req, res) => {
        req.db.db
            .collection("posts")
            .find({ type: "Help Request" })
            .sort({ date: -1 })
            .toArray(sendJSON.bind(res));
    })

    //to insert a help request
    .post((req, res) => {
        req.db.db.collection("posts").insertOne(req.body, sendJSON.bind(res));
    });


//insert comment in post with an :id
router.route("/:id/comment")

    .get((req, res) => {})
    .put((req, res) => {
        req.db.db
            .collection("posts")
            .updateOne(
                { _id: req.params.id },
                { $push: { comments: req.body } },
                sendJSON.bind(res)
            );
    });


//post and get for posts of service providers
router.route("/service_providers")
    .get((req, res) => {
        req.db.db
            .collection("posts")
            .find({ type: "Service Provider" })
            .sort({ date: -1 })
            .toArray(sendJSON.bind(res));
    })

    //to insert a help request
    .post((req, res) => {
        req.db.db.collection("posts").insertOne(req.body, sendJSON.bind(res));
    });

module.exports = router;
