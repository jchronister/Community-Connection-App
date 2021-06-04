"use strict";

const { sendJSON } = require("../middleware/return-object");

const router = require("express")();

// posts

//posts/help_requests -- post
//posts/help_requests --get  --sort by date

//posts/service_providers --post
//posts/service_providers --get  --sort by date

//posts/:_id/comment --post

//posts --get --sort by date

//posts all posts sort by date
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
    .route("/help_requests")
    .get((req, res) => {
        req.db.db
            .collection("posts")
            .find({ type: "Help Request" })
            .sort({ date: -1 })
            .toArray(sendJSON.bind(res));
    })

    //to insert a help request
    .post((req, res) => {
        req.db.db.collection("posts").insertOne(req.body).sendJSON.bind(res);
    });

//insert comment in post with an :id
router
    .route("/:id/comment")

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

//

module.exports = router;
