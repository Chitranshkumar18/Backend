import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError} from "../utils/ApiError.js"
import { ApiResponse} from "../utils/ApiResponse.js"
import { Video} from "../models/video.model.js"
import { Comment } from "../models/comments.model.js"



const addComment = asyncHandler(async (req, res) => {

// User se comment content lena
// Kis video par comment hai, uski ID lena
// Logged-in user ko owner ke roop mein identify karna
// Content validate karna
// Comment database mein create karna
// Created comment return karna. iske liye code


    const { content } = req.body;
    const { videoId } = req.params;

    if (!content?.trim()) {
        throw new ApiError(400, "Comment content is required");
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id
    });

    if (!comment) {
        throw new ApiError(500, "Comment could not be created");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, comment, "Comment added successfully"));
});



const getVideoComments = asyncHandler(async(req,res)=>{
    // Video ki ID lena
    // Us video ke saare comments database se find karna
    // Comments ke saath owner/user information bhi populate karna
    // Comments return karna

    const {videoId} = req.params;

    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(404, "Video not found")
    }

    const videocomment = await Comment.find({ video: videoId })
    .populate("owner", "username avatar");

    if(videocomment.length === 0){
        throw new ApiError(400, "comment not found")
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
              200,
              videocomment,
              "Comments fetched successfully"
          )
      );
    
})



const updateComment = asyncHandler(async(req,res)=>{
//Comment ki ID lena
//Check karna comment exist karta hai ya nahi
//Check karna ki jis user ne comment kiya tha wahi update kar raha hai
//New content validate karna
//Comment update karna
//Updated comment return karna

    // Comment ki ID lena
    const { commentId } = req.params;

    // New content lena
    const { content } = req.body;

    // Comment exist karta hai ya nahi
    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    // Check owner
    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to update this comment");
    }

    // Content validate
    if (!content?.trim()) {
        throw new ApiError(400, "Comment content is required");
    }

    // Comment update
    comment.content = content.trim();
    await comment.save();

    // Updated comment return
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                comment,
                "Comment updated successfully"
            )
        );
})


const deleteComment = asyncHandler(async(req,res)=>{

    //Comment ki ID lena
    //Comment find karna
    //Check karna comment exist karta hai ya nahi
    //Check karna owner hi delete kar raha hai
    //Comment delete karna
    //Success response dena

    const { commentId } = req.params;

    if(!commentId){
        throw new ApiError(400, "Commentid not found")
    }

    const comment = await Comment.findById(commentId)

    if(!comment){
        throw new ApiError(400, "comment not found")
    }

    if(comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to update this comment");
    }

    const deleted = await Comment.findByIdAndDelete(commentId)

    if(!deleted){
        throw new ApiError(400, "comment not deleted")
    }

    return res
       .status(200)
       .json(
        new ApiResponse(
            200,
            deleted,
            "Comment deleted successfully"
        )
       )
})
    







export{
    addComment,
    getVideoComments,
    updateComment,
    deleteComment,
}