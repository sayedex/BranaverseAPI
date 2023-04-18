import express from "express";
import {
    setSkill,
    getAllUser,
    getSingleUser,
    updateUserRole,
    deleteUser,
    getSkill
} from "../controllers/admin.controllers";
import { isAuthenticatedUser, authorizeRoles } from "../middileware/auth";

const router = express.Router();
router.get("/getSkill",getSkill)
router.post("/setSkill", isAuthenticatedUser,authorizeRoles("admin"),setSkill);
router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"),getAllUser);

router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);



export default router;
