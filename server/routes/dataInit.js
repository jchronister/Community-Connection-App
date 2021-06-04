/* eslint-disable require-jsdoc */
"use strict";

const router = require("express")();


const { ObjectId } = require("bson");
const { sendJSON } = require("../middleware/return-object");

const passDBConnection = require("../middleware/database.js");






// Reset All Data
// '/users/reset/alldata'
router.route("/reset/alldata")
  .post( passDBConnection, (req, res, next) => {

    // Update Users
    resetdata ("users", users(), req, res, next)

    
    // Update Posts
    // if (!resetdata ("posts", posts, req, res, next)) return;

    // Send Response
    .then(()=>sendJSON.call(res, null, "Data Reset Successfull"))
    .catch(next); 

    

});


function resetdata (collectionName, data, req, res, next) {

    // Delete All Data
    return req.db.db.collection(collectionName).deleteMany({})

    // Insert New Data
    .then(() => req.db.db.collection(collectionName).insertMany(data))
      
    // Get New Database Count
    .then(() => req.db.db.collection(collectionName).countDocuments({}))

    // Verify Count
    .then(n => {

      if (n !== data.length) {
        throw "Data Reset Error. Final Count Does Not Match in " + collectionName + " Collection.";
      }
      
    });
    
}




module.exports = router;



// User Accounts
function users () {
  return [
  { _id:ObjectId("60983697a6183f2328fedf93"), username:"Bipin", name:"Bipin Regmi", address:"6210 Stambaugh Road", city:"Burlington", state:"IA", zip:52601, phone:"048-739-8093", email:"bregmi@miu.edu", password:"$2a$12$/moup.44KSmffBBg9lQnM.b41qnKA81tOJKb4v1Gl5kPaw.dtPvCe"}

  ];
}



// Post Data