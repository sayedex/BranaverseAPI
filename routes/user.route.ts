import express from "express";
import {
    createUser,
    getUserinfo,
    getUserNFTbalance
} from "../controllers/user.controllers";
import { isAuthenticatedUser, authorizeRoles } from "../middileware/auth";

const router = express.Router();
router.post("/createUser", createUser);
router.route("/user").get(isAuthenticatedUser,getUserinfo);
router.post('/usernft',getUserNFTbalance)



export default router;
