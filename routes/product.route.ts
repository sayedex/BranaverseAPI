import express from "express";
import {
    addProduct,
    Buynft,
    Updateproduct,
    removeproduct,
    testsignature,
    getAllProducts,
    getSingleProducts
} from "../controllers/product.controllers";
import { isAuthenticatedUser, authorizeRoles } from "../middileware/auth";

//nonce..
import withIronSessionApiRoute from "../controllers/nonce"

const router = express.Router();
router.post("/addProduct", addProduct);
router.post("/Buynft",Buynft);
router.post("/Updateproduct/:id",Updateproduct);
router.delete("/removeproduct/:productId", removeproduct);
router.get('/testsignature',testsignature)
router.get('/nonce',withIronSessionApiRoute)
router.route("/allproducts").get(getAllProducts);
router.route("/product/:id").get(getSingleProducts);


export default router;
