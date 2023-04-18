import express from "express";
import {
    totaluser
} from "../controllers/user.controllers";

import { isAuthenticatedUser, authorizeRoles } from "../middileware/auth";


const router = express.Router();

router.get("/totaluser",totaluser);



export default router;
