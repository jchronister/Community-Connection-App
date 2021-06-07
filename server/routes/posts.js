"use strict";

const { sendJSON } = require("../middleware/return-object");

const router = require("express")();

// posts

//posts/help_requests -- post//!Done
//posts/help_requests --get  --sort by date //!Done

//posts/service_providers --post//!Done
//posts/service_providers --get  --sort by date//!Done

//posts/:_id/comment --post //!Done

//posts --get --sort by date //!Done

//posts all posts sort by date

router.param("id", (req, res, next, id) => {
    if (verifyMongoId(req.params, "id", next)) {
        next();
    }
});

router
    .route("/")

    .get((req, res) => {
        req.db.db
            .collection("posts")
            .find()
            .limit(25)
            .toArray(sendJSON.bind(res));
    })
    .post((req, res) => {});

//sort help_requests by date
router
    .route("/help-requests")
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
router
    .route("/:id/comments")

    .get((req, res) => {})
    .put((req, res) => {
        req.db.db.collection("posts").updateOne(
            { _id : req.params.id }, //TODO: verifyMongoid is not defined
            { $push: { comments: req.body } },
            sendJSON.bind(res)
        );
    });

//post and get for posts of service providers
router
    .route("/service-providers")
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
