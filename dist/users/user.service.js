"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userWithDetailService = exports.userWithNameiLikeService = exports.deleteUserService = exports.updateUserService = exports.createUserService = exports.getSingleUserService = exports.userService = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../drizzle/db");
const schema_1 = require("../drizzle/schema");
const userService = async () => {
    return await db_1.default.query.Users.findMany();
};
exports.userService = userService;
//get one user
const getSingleUserService = async (id) => {
    return await db_1.default.query.Users.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.Users.user_id, id),
    });
};
exports.getSingleUserService = getSingleUserService;
//create user
const createUserService = async (user) => {
    const { email, contact_phone } = user;
    if (!email || !contact_phone) {
        throw new Error("Email or Contact Phone is undefined.");
    }
    //check if the email and contact_phone exists in the database
    const existingUser = await db_1.default.select().from(schema_1.Users).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.Users.email, email), (0, drizzle_orm_1.eq)(schema_1.Users.contact_phone, contact_phone))).execute();
    if (existingUser) {
        return "A user with this email and contact_phone already exists.";
    }
    await db_1.default.insert(schema_1.Users).values(user);
    return user;
};
exports.createUserService = createUserService;
//update user
const updateUserService = async (id, user) => {
    await db_1.default.update(schema_1.Users).set(user).where((0, drizzle_orm_1.eq)(schema_1.Users.user_id, id));
    return user;
};
exports.updateUserService = updateUserService;
//delete user
const deleteUserService = async (id) => {
    await db_1.default.delete(schema_1.Users).where((0, drizzle_orm_1.eq)(schema_1.Users.user_id, id));
    return "user deleted successfully!😑";
};
exports.deleteUserService = deleteUserService;
const userWithNameiLikeService = async (name) => {
    return await db_1.default
        .select()
        .from(schema_1.Users)
        .where((0, drizzle_orm_1.ilike)(schema_1.Users.full_name, `%${name}%`));
};
exports.userWithNameiLikeService = userWithNameiLikeService;
//user with bookings and customer support tickets
const userWithDetailService = async () => {
    return await db_1.default.query.Users.findMany({
        columns: {
            user_id: false,
            created_at: false,
            updated_at: false,
        },
        with: {
            bookings: {
                columns: {
                    booking_date: true,
                    return_date: true,
                    total_amount: true,
                    booking_status: true,
                },
            },
        },
    });
};
exports.userWithDetailService = userWithDetailService;
