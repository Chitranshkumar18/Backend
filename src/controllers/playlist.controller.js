import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Playlist } from "../models/playlist.model.js";

const createPlaylist = asyncHandler(async(req,res)=>{
   // Request se playlist details lena:
   // name
   // description
   // Logged-in user ki ID lena.
   // Check karna name provided hai.
   // Name empty hai ya nahi validate karna.
   // Playlist create karna with:
   // name
   // description
   // owner
   // videos initially empty, if required by model.
   // Check karna playlist successfully create hui hai.
   // Created playlist return karna.

    const { name, description } = req.body;

    if (!name || !description) {
        throw new ApiError(400, "Name and description are required");
    }

    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: userId
    });

    if (!playlist) {
        throw new ApiError(
            400,
            "Something went wrong while creating playlist"
        );
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                playlist,
                "Playlist created successfully"
            )
        );
})


const getUserPlaylists = asyncHandler(async(req,res)=>{
    // Logged-in user ki ID lena.
    // Check karna user authenticated hai.
    // Database se current user ki playlists find karna.
    // Required related information populate karna, if needed.
    // Playlists ko required order mein sort karna.
    // Check karna playlists mili hain ya nahi.
    // User ki playlists return karna.

    const userId = req.user?._id;

    if(!userId){
        throw new ApiError(400, "User ID is required");
    }

    const playlist = await Playlist.find({
        owner: userId
    })

    if(playlist.length === 0){
        throw new ApiError(200, "playlist not exist")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                playlist,
                "Playlist fetched successfully"
            )
        )

})



const getPlaylistById = asyncHandler(async(req,res)=>{
   // playlistId lena.
   // Check karna playlistId provided hai.
   // Playlist database se find karna.
   // Check karna playlist exist karti hai ya nahi.
   // Required related information populate karna:
   // owner
   // videos
   // Playlist return karna.

    const { playlistId } = req.params;

    if (!playlistId) {
        throw new ApiError(400, "Playlist ID is required");
    }

    const playlist = await Playlist.findById(playlistId)
        .populate("owner")
        .populate("videos");

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                playlist,
                "Playlist fetched successfully"
            )
        );
})


const addVideoToPlaylist = asyncHandler(async(req,res)=>{
   // playlistId lena.
   // videoId lena.
   // Check karna dono IDs provided hain.
   // Playlist database se find karna.
   // Check karna playlist exist karti hai ya nahi.
   // Check karna logged-in user playlist ka owner hai.
   // Video database se find karna.
   // Check karna video exist karta hai ya nahi.
   // Check karna video already playlist mein hai ya nahi.
   // Agar already hai → error return karna.
   // Video ID ko playlist ke videos array mein add karna.
   // Playlist save karna.
   // Updated playlist return karna.

   const {playlistId} = req.params
   if(!playlistId){
    throw new ApiError(400, "playlist ID is required")
   }

   const {videoId} = req.body
   if(!videoId){
    throw new ApiError(400, "video ID is required")
   }

   const playlist = await Playlist.findById(playlistId)
   if(!playlist){
    throw new ApiError(404, "playlist not found")
   }

   const userId = req.user?._id;
   if(!userId){
    throw new ApiError(400, "user is not login")
   }

   if(playlist.owner.toString() !== userId.toString()){
    throw new ApiError(400,"You are not authorized to add video to this playlist")
   }

   const video = await Video.findById(videoId)
   if(!video){
    throw new ApiError(404,"video not found")
   }

   if(playlist.videos.includes(videoId)){
    throw new ApiError(400,"video already exists in playlist")
   }
   
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $push: {
                videos: videoId
            }
        },
        {
            new: true
        }
    );

    if(!updatedPlaylist){
        throw new ApiError(400,"Something went wrong while adding video to playlist")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedPlaylist,
                "Video added to playlist successfully"
            )
        )
})


const removeVideoFromPlaylist = asyncHandler(async(req,res)=>{
    // playlistId lena.
    // videoId lena.
    // Check karna dono IDs provided hain.
    // Playlist database se find karna.
    // Check karna playlist exist karti hai ya nahi.
    // Check karna logged-in user playlist ka owner hai.
    // Check karna video playlist mein exist karta hai ya nahi.
    // Agar video playlist mein nahi hai → error return karna.
    // Video ID ko playlist ke videos array se remove karna.
    // Playlist save karna.
    // Updated playlist return karna.

    // 1. playlistId lena.
    const { playlistId } = req.params;

    // 2. videoId lena.
    const { videoId } = req.body;

    // 3. Check karna dono IDs provided hain.
    if (!playlistId) {
        throw new ApiError(400, "Playlist id is required");
    }

    if (!videoId) {
        throw new ApiError(400, "Video id is required");
    }

    // 4. Playlist database se find karna.
    const playlist = await Playlist.findById(playlistId);

    // 5. Check karna playlist exist karti hai ya nahi.
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    // 6. Check karna logged-in user playlist ka owner hai.
    if (req.user?._id.toString() !== playlist.owner.toString()) {
        throw new ApiError(
            403,
            "You are not authorized to remove video from this playlist"
        );
    }

    // 7. Check karna video playlist mein exist karta hai ya nahi.
    if (!playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video not found in playlist");
    }

    // 8. Video ID ko playlist ke videos array se remove karna.
    playlist.videos.pull(videoId);

    // 9. Playlist save karna.
    await playlist.save();

    // 10. Updated playlist return karna.
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                playlist,
                "Video removed from playlist successfully"
            )
        );
})

const deletePlaylist = asyncHandler(async(req,res)=>{
   // playlistId lena.
   // Check karna playlistId provided hai.
   // Playlist database se find karna.
   // Check karna playlist exist karti hai ya nahi.
   // Check karna logged-in user playlist ka owner hai.
   // Playlist database se delete karna.
   // Delete successful hua ya nahi verify karna.
   // Success response return karna.

   const {playlistId} = req.params
   if(!playlistId){
    throw new ApiError(400,"playlist ID is required")
   }

   const playlist = await Playlist.findById(playlistId)
   if(!playlist){
    throw new ApiError(404,"playlist not found")
   }

   const userId = req.user?._id
   if(!userId){
    throw new ApiError(404, "user is not login")
   }

   if(playlist.owner.toString() !== userId.toString()){
    throw new ApiError(400,"you are not authorized to delete this playlist")
   }

   const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId)
   if(!deletedPlaylist){
    throw new ApiError(400,"something went wrong while deleting playlist")
   }

   return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            deletedPlaylist,
            "Playlist deleted successfully"
        )
    )

})


const updatePlaylist = asyncHandler(async(req,res)=>{
    // playlistId lena.
    // New playlist details lena:
    // name
    // description
    // Check karna playlistId provided hai.
    // Playlist database se find karna.
    // Check karna playlist exist karti hai ya nahi.
    // Check karna logged-in user playlist ka owner hai.
    // Jo fields update karni hain unko validate karna.
    // name provided hai to name update karna.
    // description provided hai to description update karna.
    // Updated playlist save karna.
    // Updated playlist return karna.

    const {playlistId} = req.params
    if(!playlistId){
        throw new ApiError(403,"playlistId is requried")
    }

    const {name,description} = req.body
    if(!name || !description){
        throw new ApiError(400, "name and description are required")
    }

    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404,"playlist not found")
    }

    if(playlist.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(400,"you are not authorized to update this playlist")
    }

    if (name === undefined && description === undefined) {
        throw new ApiError(
            400,
            "At least one field is required"
        );
    }

    if (name !== undefined && !name.trim()) {
        throw new ApiError(400, "Playlist name cannot be empty");
    }

    if (description !== undefined && !description.trim()) {
        throw new ApiError(400, "Playlist description cannot be empty");
    }

    const updateFields = {}
    if (name !== undefined) {
        updateFields.name = name.trim();
    }

    if (description !== undefined) {
        updateFields.description = description.trim();
    }


    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: updateFields
        },
        {
            new: true
        }
    )

    if(!updatedPlaylist){
        throw new ApiError(403,"something went wrong while updating playlist")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedPlaylist,
                "Playlist updated successfully"
            )
        )
})
    


export{
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist

}
