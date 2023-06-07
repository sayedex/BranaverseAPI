import express from "express";
import {
    addtoken,getToken
} from "../controllers/token.controllers";
import {addBank} from "../controllers/admin.controllers"
import { isAuthenticatedUser, authorizeRoles } from "../middileware/auth";

const router = express.Router();
router.post("/addtoken", addtoken);
router.post("/addBank", addBank);
router.get("/getToken",getToken)


export default router;
