"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLoginService = exports.registerUserService = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db_1 = require("../drizzle/db");
const schema_1 = require("../drizzle/schema");
const validators_1 = require("../validators");
const secret = process.env.JWT_SECRET;
const expiresIn = process.env.EXPIRES;
const registerUserService = async (user) => {
    // Validate the user data using parse method to check if the data is valid
    validators_1.userSchema.parse(user);
    validators_1.registerUserSchema.parse(user);
    //check if the user already exist
    const userExist = await db_1.default
        .select()
        .from(schema_1.Users)
        .where((0, drizzle_orm_1.eq)(schema_1.Users.email, user.email))
        .execute();
    if (userExist.length > 0) {
        throw new Error("user with credentials already exist");
    }
    // Hash the user's password
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    // Insert the data into the Users table
    const newUser = await db_1.default
        .insert(schema_1.Users)
        .values({
        full_name: user.full_name,
        email: user.email,
        contact_phone: user.contact_phone,
        address: user.address,
        role: user.role,
    })
        .returning({ id: schema_1.Users.user_id })
        .execute();
    //insert the data into the Authentication table
    const user_id = newUser[0].id;
    try {
        await db_1.default
            .insert(schema_1.Authentication)
            .values({
            user_id: user_id,
            password: hashedPassword,
        })
            .execute();
        return "User registered successfully!👽";
    }
    catch (error) {
        // rollback: delete the user from the Users table if it fails to insert into the Authentication table by id
        await db_1.default.delete(schema_1.Users).where((0, drizzle_orm_1.eq)(schema_1.Users.user_id, user_id)).execute();
        throw new Error("Failed to register user");
    }
};
exports.registerUserService = registerUserService;
const userLoginService = async (email, password) => {
    try {
        // Validate the user data using parse method to check if the data is valid using loginUserSchema
        validators_1.loginUserSchema.parse({ email, password });
        // Find the user in the Users table by email
        const users = await db_1.default
            .select()
            .from(schema_1.Users)
            .where((0, drizzle_orm_1.eq)(schema_1.Users.email, email))
            .execute();
        if (users.length === 0) {
            return null; // User not found
        }
        // Get the user object from the Users table
        const user = users[0];
        // Get the user's password from the Authentication table
        const auths = await db_1.default
            .select()
            .from(schema_1.Authentication)
            .where((0, drizzle_orm_1.eq)(schema_1.Authentication.user_id, user.user_id))
            .execute();
        if (auths.length === 0) {
            throw new Error("Authentication record not found for user_id"); // Authentication details not found
        }
        //fetch the user's hashed password from the Authentication table
        const hashedPassword = auths[0];
        //check if the provided password matches the hashed password
        const passwordsMatch = await bcrypt.compare(password, hashedPassword.password);
        if (!passwordsMatch) {
            console.error("Invalid password", user);
            throw new Error("Invalid password");
        }
        // Create a JWT token
        const token = jwt.sign({ id: user.user_id, email: user.email, role: user.role }, secret, { expiresIn });
        console.log("token", token);
        return { token, user };
    }
    catch (error) {
        console.error("User login service error:", error); // Log the error for debugging
        throw new Error("Failed to login user");
    }
};
exports.userLoginService = userLoginService;
