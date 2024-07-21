"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userWithDetail = exports.userWithNameiLike = exports.deleteUser = exports.updateUser = exports.createUser = exports.getSingleUser = exports.listUsers = void 0;
const user_service_1 = require("./user.service");
const mail_1 = require("../nodemailer/mail");
const listUsers = async (c) => {
    const data = await (0, user_service_1.userService)();
    if (data == null) {
        return c.text("no user found!😶‍🌫️👽", 404);
    }
    return c.json(data, 200);
};
exports.listUsers = listUsers;
//get single user
const getSingleUser = async (c) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id))
        return c.text("invalid ID!", 400);
    const user = await (0, user_service_1.getSingleUserService)(id);
    if (user == undefined) {
        return c.text("user not found!👽", 404);
    }
    return c.json(user, 200);
};
exports.getSingleUser = getSingleUser;
//create user
const createUser = async (c) => {
    try {
        //get the user object from the request
        const user = await c.req.json();
        console.log(user);
        //get the password from the user object
        // const pass = user.password;
        // //hash the password
        // const hashedPassword = await bcrypt.hash(pass, 10);
        // //replace the password with the hashed password
        // user.password = hashedPassword;
        // create the user
        const createdUser = await (0, user_service_1.createUserService)(user);
        if (!createdUser) {
            return c.text("user not created!👽", 404);
        }
        // Send registration email
        const eventname = "Vehicle Rental Service";
        const emailResponse = await (0, mail_1.sendRegistrationEmail)(user.email, eventname);
        console.log("emailResponse:", emailResponse);
        return c.json({ msg: createdUser, emailResponse }, 201);
    }
    catch (error) {
        return c.json({ error: error?.message }, 400);
    }
};
exports.createUser = createUser;
//update user
const updateUser = async (c) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id))
        return c.text("invalid ID!", 400);
    const user = await c.req.json();
    try {
        //search for user
        const founduser = await (0, user_service_1.getSingleUserService)(id);
        if (founduser == undefined)
            return c.text("user not found!👽", 404);
        //get the data and update
        const res = await (0, user_service_1.updateUserService)(id, user);
        //return the updated user
        if (!res)
            return c.text("user not updated!👽", 404);
        return c.json({ msg: res }, 201);
    }
    catch (error) {
        return c.json({ error: error?.message }, 400);
    }
};
exports.updateUser = updateUser;
//delete user
const deleteUser = async (c) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id))
        return c.text("invalid ID!", 400);
    try {
        //search for the user
        const user = await (0, user_service_1.getSingleUserService)(id);
        if (user == undefined)
            return c.text("user not found!👽", 404);
        //delete the user
        const res = await (0, user_service_1.deleteUserService)(id);
        if (!res)
            return c.text("user not deleted!👽", 404);
        return c.json({ msg: res }, 201);
    }
    catch (error) {
        return c.json({ error: error?.message }, 400);
    }
};
exports.deleteUser = deleteUser;
//get user with name
const userWithNameiLike = async (c) => {
    try {
        const name = String(c.req.query("name"));
        const data = await (0, user_service_1.userWithNameiLikeService)(name);
        if (data == null) {
            return c.text("no user found!😶‍🌫️👽", 404);
        }
        return c.json(data, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 400);
    }
};
exports.userWithNameiLike = userWithNameiLike;
//get user with details
const userWithDetail = async (c) => {
    try {
        const data = await (0, user_service_1.userWithDetailService)();
        if (data == null) {
            return c.text("no user found!😶‍🌫️👽", 404);
        }
        return c.json(data, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 400);
    }
};
exports.userWithDetail = userWithDetail;
