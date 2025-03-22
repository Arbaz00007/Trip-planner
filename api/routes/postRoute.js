import express from "express";
import {
  createPost,
  getPosts,
  getSinglePost,
  deletePost,
  updatePost,
} from "../controller/post.js";
import upload from "../middleware/multerConfig.js";
import { checkAdmin, isAuth } from "../middleware/isAuth.js";

const route = express.Router();

route.post("/createPost", upload.array("images", 5), createPost);
route.get("/getPosts", getPosts);
route.get("/getSinglePost/:id", getSinglePost);
route.post("/update-post/:pid", upload.array("images", 5), updatePost);
route.post("/delete-post/:pid", deletePost);

export default route;
