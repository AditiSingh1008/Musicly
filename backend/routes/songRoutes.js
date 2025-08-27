import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import uploadFile from "../middlewares/multer.js";
import {
  addSong,
  addThumbnail,
  createAlbum,
  deleteSong,
  getAllAlbums,
  getAllSongs,
  getAllSongsByAlbum,
  getSingleSong,
  searchSongs, // ✅ Added
} from "../controllers/songControllers.js";

const router = express.Router();

router.post("/album/new", isAuth, uploadFile, createAlbum);
router.get("/album/all", isAuth, getAllAlbums);
router.post("/new", isAuth, uploadFile, addSong);
router.post("/:id", isAuth, uploadFile, addThumbnail);
router.get("/single/:id", isAuth, getSingleSong);
router.get("/all", isAuth, getAllSongs);
router.get("/search", isAuth, searchSongs); // ✅ Search route
router.get("/album/:id", isAuth, getAllSongsByAlbum);
router.delete("/:id", isAuth, deleteSong);

export default router;
