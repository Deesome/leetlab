import {Router} from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { addProblemToPlaylist, createPlayList, deletePlaylist, deleteProblemFromPlaylist, getAllPlaylistDetails, getPlaylistDetails } from "../controllers/playlist.controllers.js"

const playlistRouter = Router()

playlistRouter.route("/create-playlist").post(authMiddleware,createPlayList)
playlistRouter.route("/get-all-playlists").get(authMiddleware,getAllPlaylistDetails)
playlistRouter.route("/:playlistId").get(authMiddleware,getPlaylistDetails)
playlistRouter.route("/add-problem/:playlistId").post(authMiddleware,addProblemToPlaylist)
playlistRouter.route("/:playlistId/remove-problem").post(authMiddleware,deleteProblemFromPlaylist)
playlistRouter.route("/:playlistId").post(authMiddleware,deletePlaylist)


export default playlistRouter