import 'dotenv/config';
import express from 'express';
import asyncHandler from 'express-async-handler';
import * as users from './user_model.mjs';

const app = express();

const PORT = process.env.PORT;

app.get("/create", asyncHandler (async (req, res) => {
    // Inititialize data with required parameter
    const data = {name: req.query.name, age: req.query.age, email: req.query.email};
    // Only add a phone number if it is given
    if (req.query.phoneNumber !== undefined){
        data.phoneNumber = req.query.phoneNumber;
    }
    // Creates and saves the new user 
    const user = await users.createUser(data);
    res.send(user);
}))

app.get("/retrieve", asyncHandler (async (req, res) => {
    const filter = {};
    // Make sure each relevant query parameter that was passed is added to filter
    const properties = ["name", "age", "email", "phoneNumber", "_id"];
    for (let prop of properties){
        if (req.query[prop] !== undefined){
            filter[prop] = req.query[prop];
        }
    }
    // Query based on filter is executed by model, send back the result of the query
    const result = await users.findUser(filter);
    res.send(result);
}))

app.get("/update", asyncHandler ( async (req, res) => {
    const update = {};
    // Add any request query parameters that are NOT id to the update
    const properties = ["name", "age", "email", "phoneNumber"];
    for (let prop of properties){
        if (req.query[prop] !== undefined){
            update[prop] = req.query[prop];
        }
    }
    // Update the movie with the request query parameters
    // The updateUser nethod wil lreturn {acknowledged: false} if update is empty like {}
    let result = await users.updateUser({_id: req.query._id}, update);
    // If no movie was found, return an error
    if (result === 0){
        res.send({"Error": "Not found"});
    } else {
    // result is the sum of the number of modified and matched documents
    // decrement result if matched
    result -= 1;
    res.send({"updateCount": result});
    }
}))

app.get("/delete", asyncHandler ( async (req, res) => {
    // Check the following query parameters, more can be added as needed
    const properties = ["name", "age", "email", "phoneNumber", "_id"];
    const condition = {};
    // Only one query parameter is given for delete operations
    for (let prop of properties){
        if (req.query[prop] !== undefined){
            condition[prop] = req.query[prop];
            // Exit the loop once only query parameter is found
            break
        }
    }
    // Delete documents matching condition and return count
    const result = await users.deleteByCondition(condition);
    res.send({"deletedCount": result});
}))

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});