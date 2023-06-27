import express from "express";
import {
    addProduct,
    Buynft,
    Updateproduct,
    removeproduct,
    testsignature,
    getAllProducts,
    getSingleProducts,
    Getfeaturedproduct
} from "../controllers/product.controllers";
import { isAuthenticatedUser, authorizeRoles } from "../middileware/auth";

//nonce..
import withIronSessionApiRoute from "../controllers/nonce"

const router = express.Router();
router.post("/addProduct", isAuthenticatedUser,authorizeRoles("admin"),addProduct);
router.post("/Buynft",isAuthenticatedUser,Buynft);
router.post("/Updateproduct/:id",isAuthenticatedUser,authorizeRoles("admin"),Updateproduct);
router.delete("/removeproduct/:productId",isAuthenticatedUser,authorizeRoles("admin"), removeproduct);
router.get('/testsignature',testsignature)
router.get('/nonce',withIronSessionApiRoute)
router.route("/allproducts").get(getAllProducts);
router.route("/getfeaturedproduct").get(Getfeaturedproduct)
router.route("/product/:id").get(getSingleProducts);


export default router;
