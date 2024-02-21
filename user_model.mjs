import mongoose from 'mongoose';
import 'dotenv/config';

mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
    { useNewUrlParser: true }
);

const db = mongoose.connection;

/**
 * Define the schema for User js object, maps to a MongoDB document
 */
const userSchema = mongoose.Schema({
	name: { type: String, required: true },
	age: { type: Number, required: true },
	email: { type: String, required: true },
    phoneNumber: { type: Number, required: false}
});

/**
 * Compile the model from our the schema
 */
const User = mongoose.model("User", userSchema);

/** 
 * Create a user
 * @param {String} name
 * @param {Number} age
 * @param {String} email
 * @param {Number} phoneNumber
 * @returns A promise. Resolves to JavaScript object for the document created
 *          by calling save.
*/
const createUser = async (data) => {
    // Create the new user
    const user = new User(data);
    // Call save to persist this object as a document in MongoDB
    return user.save();
}

/**
 * Find user(s) in our database based on a filter parameter
 * @param {Object} filter
 * @returns {Object} The MongoDB results from the query
 */
const findUser = async (filter) => {
    const query = User.find(filter);
    // returns an array of documents matching the query
    return query.exec();
}

/**
 * Update a user in our database. Receives the id of the user to be updated
 * and an object with the parameters that should be replaced, and the new values
 * @param {Object} filter
 * @param {object} update
 * @returns {Number} 1 if updated and 0 if not found
 */
const updateUser = async(filter, update) => {
    const result = await User.updateOne(filter, update);
    if (result.acknowledged === true){
        // We matched the id
        const num = (result.matchedCount + result.modifiedCount)
        return num;
    } else {
    // If we could not match the id
    return 0
    }
}

/**
 * Deletes all users matching the condtion.
 * @param {*} condition 
 * @returns The number of items deleted
 */
const deleteByCondition = async (condition) => {
    const result = await User.deleteMany(condition);
    return result.deletedCount;
}

db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});

export {createUser, findUser, updateUser, deleteByCondition};