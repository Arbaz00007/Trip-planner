import express from "express";
import { createPost, getPosts, getSinglePost } from "../controller/post.js";
import upload from "../middleware/multerConfig.js";

const route = express.Router();

route.post("/createPost", upload.array("images", 5), createPost);
route.get("/getPosts", getPosts);
route.get("/getSinglePost/:id", getSinglePost);

export default route;
