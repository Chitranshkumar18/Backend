import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError} from "../utils/ApiError.js"
import { ApiResponse} from "../utils/ApiResponse.js"
import { Video} from "../models/video.model.js"
import { Comment } from "../models/comments.model.js"
import { Tweet } from "../models/tweet.model.js"



const toggleVideoLike = asyncHandler(async(req,res)=>{
    // videoId lena.
    // Logged-in user ki ID lena.
    // Check karna ki video exist karta hai ya nahi.
    // Check karna ki user ne already is video ko like kiya hai ya nahi.
    // Agar like already hai → Like document delete karna (unlike).
    // Agar like nahi hai → Like document create karna (like).
    //Appropriate success message return karna.

    // videoId lena
    const { videoId } = req.params;

    if(!videoId){
        throw new ApiError(400, "videoId is required");
    }

    // Logged-in user ki ID lena
    const userId = req.user._id;

    if(!userId){
        throw new ApiError(401, "user not found");
    }

    // Video exist karta hai ya nahi
    const video = await Video.findById(videoId);

    if(!video){
        throw new ApiError(404, "Video not found");
    }

    // Check user ne already like kiya hai ya nahi
    const existingLike = await Like.findOne({
        video: videoId,
        likeBy: userId
    });

    // Already liked → Unlike
    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    null,
                    "Video unliked successfully"
                )
            );
    }

    // Not liked → Like
    const like = await Like.create({
        video: videoId,
        likeBy: userId
    });

    if(!like){
        throw new ApiError(500, "Failed to like video");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                like,
                "Video liked successfully"
            )
        );    
    
})




const toggleCommentLike = asyncHandler(async(req,res)=>{

    //commentId lena
    //Logged-in user ki ID lena.
    //Check karna comment exist karta hai ya nahi.
    //Check karna ki user ne already is comment ko like kiya hai ya nahi.
    //Agar like already hai → Like delete karna.
    //Agar like nahi hai → Like create karna.
    //Success response return karna.

    const {commentId} = req.params
    if(!commentId){
        throw new ApiError(400, "commentId is required")
    }

    const userId = req.user._id;

    if(!userId){
        throw new ApiError(401, "user not found");
    }

    const comment = await Comment.findById(commentId);

    if(!comment){
        throw new ApiError(404, "Comment not found");
    }

    const existingLike = await Like.findOne({
        comment: commentId,
        likeBy: userId
    })
    
    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    null,
                    "comment unliked successfully"
                )
            );
    }

    const Like = await Like.create({
        comment: commentId,
        likeBy: userId
    })

    if(!Like){
        throw new ApiError(500, "Failed to like comment");
    }
    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            Like,
            "comment liked successfully"
        )
    );    
})



const toggleTweetLike = asyncHandler(async(req,res)=>{
    // tweetId lena.
    // Logged-in user ki ID lena.
    // Check karna tweet exist karta hai ya nahi.
    // Check karna user ne already tweet like kiya hai ya nahi.
    // Already like hai → Like delete.
    // Like nahi hai → Like create.
    //Success response return.

    const {tweetId} = req.params
    if(!tweetId){
        throw new ApiError(400, "tweetId is required")
    }

    const userId = req.user._id;
    
    if(!userId){
        throw new ApiError(401, "user not found");
    }

    const tweet = await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(404, "Tweet not found")
    }

    const existingLike = await Like.findOne({
        tweet: tweetId,
        likeBy: userId
    })

    if(existingLike){
        await Tweet.findByIdAndDelete(existingLike._id)

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                null,
                "tweet unlike successfully"
            )
        )
    }

    const like = await Like.create({
        tweet: tweetId,
        likeBy: userId
    })

    if(!like){
        throw new ApiError(500, "Failed to like tweet");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                like,
                "tweet liked successfully"
            )
        )
})



const getLikedVideos = asyncHandler(async(req,res)=>{
     //Logged-in user ki ID lena.
    //Like collection mein us user ke likes find karna.
    //Sirf video wale likes filter karna.
    //Related video information populate karna.
    //Agar koi liked video nahi hai → appropriate response dena.
    //Liked videos return karna.

    const userId = req.user._id;

    if(!userId){
        throw new ApiError(401, "userid not found");
    }

    const likedVideos = await Like.find({
        likeBy : userId,
        video: { $exists: true }
    }).populate("video");

    if(likedVideos.length === 0){
       return res
       .status(200)
       .json(
        new ApiResponse(
            200,
            [],
            "No liked videos found"
        )
       );
    }

    return res
       .status(200)
       .json(
        new ApiResponse(
            200,
            likedVideos,
            "Liked videos fetched successfully"
        )
       );
    
})


export{
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
}

