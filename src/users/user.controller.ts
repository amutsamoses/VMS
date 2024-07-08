import { Context } from "hono";
import {
  userService,
  getSingleUserService,
  createUserService,
  updateUserService,
  deleteUserService,
  userWithNameiLikeService,
} from "./user.service";
import * as bcrypt from "bcrypt";

import { sendRegistrationEmail } from "../nodemailer/mail";

export const listUsers = async (c: Context) => {
  const data = await userService();
  if (data == null) {
    return c.text("no user found!😶‍🌫️👽", 404);
  }
  return c.json(data, 200);
};

//get single user
export const getSingleUser = async (c: Context) => {
  const id = parseInt(c.req.param("id"));
  if (isNaN(id)) return c.text("invalid ID!", 400);

  const user = await getSingleUserService(id);
  if (user == undefined) {
    return c.text("user not found!👽", 404);
  }
  return c.json(user, 200);
};

//create user
export const createUser = async (c: Context) => {
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
    const createdUser = await createUserService(user);
    if (!createdUser) {
      return c.text("user not created!👽", 404);
    }

    // Send registration email
    const eventname: string = "Vehicle Rental Service";
    const emailResponse = await sendRegistrationEmail(user.email, eventname);
    console.log("emailResponse:", emailResponse);

    return c.json({ msg: createdUser, emailResponse }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

//update user
export const updateUser = async (c: Context) => {
  const id = parseInt(c.req.param("id"));
  if (isNaN(id)) return c.text("invalid ID!", 400);

  const user = await c.req.json();
  try {
    //search for user
    const founduser = await getSingleUserService(id);
    if (founduser == undefined) return c.text("user not found!👽", 404);
    //get the data and update
    const res = await updateUserService(id, user);
    //return the updated user
    if (!res) return c.text("user not updated!👽", 404);
    return c.json({ msg: res }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

//delete user
export const deleteUser = async (c: Context) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.text("invalid ID!", 400);

  try {
    //search for the user
    const user = await getSingleUserService(id);
    if (user == undefined) return c.text("user not found!👽", 404);
    //delete the user
    const res = await deleteUserService(id);
    if (!res) return c.text("user not deleted!👽", 404);

    return c.json({ msg: res }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

// //get user with order
// export const userWithOrder = async (c: Context) => {
//   try {
//     const data = await userWithOrderService();
//     if (data == null) {
//       return c.text("no user found!😶‍🌫️👽", 404);
//     }
//     return c.json(data, 200);
//   } catch (error: any) {
//     return c.json({ error: error?.message }, 400);
//   }
// };

//get user with name
export const userWithNameiLike = async (c: Context) => {
  try {
    const name = String(c.req.query("name"));
    const data = await userWithNameiLikeService(name);
    if (data == null) {
      return c.text("no user found!😶‍🌫️👽", 404);
    }
    return c.json(data, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};
