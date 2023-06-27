import express from "express";
import { getAllinfo } from "../controllers/admin.controllers";

import { isAuthenticatedUser, authorizeRoles } from "../middileware/auth";

const router = express.Router();
router.get("/getalldata",getAllinfo);


export default router;
