import express from "express";
import {
getAllorder
} from "../controllers/order.controllers";
import { isAuthenticatedUser, authorizeRoles } from "../middileware/auth";


const router = express.Router();

router.route("/getAllorder").get(getAllorder);

export default router;
