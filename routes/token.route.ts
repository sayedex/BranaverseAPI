import express from "express";
import {
    addtoken,getToken
} from "../controllers/token.controllers";
import {addBank} from "../controllers/admin.controllers"
import { isAuthenticatedUser, authorizeRoles } from "../middileware/auth";

const router = express.Router();
//isAuthenticatedUser,authorizeRoles("admin"),
router.post("/addtoken",isAuthenticatedUser,authorizeRoles("admin"), addtoken);
router.post("/addBank",isAuthenticatedUser,authorizeRoles("admin"), addBank);
router.get("/getToken",getToken)


export default router;
