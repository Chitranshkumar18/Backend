import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError} from "../utils/ApiError.js"
import { ApiResponse} from "../utils/ApiResponse.js"
import { Tweet } from "../models/tweet.model.js"


const createTweet = asyncHandler(async(req,res)=>{

    const { content } = req.body;

    if(!content?.trim()){
        throw new ApiError(400, "Tweet content is required");
    }

    const userId = req.user._id;

    if(!userId){
        throw new ApiError(401, "User not found");
    }

    const tweet = await Tweet.create({
        content: content.trim(),
        owner: userId
    });

    if(!tweet){
        throw new ApiError(500, "Tweet could not be created");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                tweet,
                "Tweet created successfully"
            )
        );
});


const getUserTweets = asyncHandler(async(req,res)=>{
    // User ki ID lena — kis user ke tweets chahiye ye decide karna.
    // Check karna user exist karta hai ya nahi, agar required ho.
    // Us user ke tweets database se find karna.
    // Required user/owner information populate karna, agar zarurat ho.
    // Tweets ko desired order mein lana, usually newest first.
    // Agar tweets nahi hain → empty array return karna.
    //Tweets return karna.

    const userId = req.user._id;

    if(!userId){
        throw new ApiError(401, "User not found");
    }

    const tweets = await Tweet.find({
        owner: userId
    })
    .populate("owner", "username avatar")
    .sort({ createdAt: -1 });

    if(tweets.length === 0){
        throw new ApiError(404, "No tweets found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                tweets,
                "User tweets fetched successfully"
            )
        );
})

const updateTweet = asyncHandler(async(req,res)=>{
     //tweetId lena.
     //New tweet content lena.
     //Tweet exist karta hai ya nahi check karna.
     //Check karna ki tweet ka owner aur logged-in user same hain.
     //New content validate karna.
     //Tweet content update karna.
     //Updated tweet save karna.
     //Updated tweet return karna.
    // tweetId lena
    const { tweetId } = req.params;

    if(!tweetId){
        throw new ApiError(400, "tweetId is required");
    }

    // New tweet content lena
    const { content } = req.body;

    if(!content?.trim()){
        throw new ApiError(400, "Tweet content is required");
    }

    // Tweet exist karta hai ya nahi
    const tweet = await Tweet.findById(tweetId);

    if(!tweet){
        throw new ApiError(404, "Tweet not found");
    }

    // Owner check
    if(tweet.owner.toString() !== req.user._id.toString()){
        throw new ApiError(
            403,
            "You are not allowed to update this tweet"
        );
    }

    // Tweet update
    tweet.content = content.trim();

    // Save updated tweet
    await tweet.save();

    // Updated tweet return
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                tweet,
                "Tweet updated successfully"
            )
        );

})



const deleteTweet = asyncHandler(async(req,res)=>{
      //tweetId lena.
      //Tweet find karna.
      //Check karna tweet exist karta hai ya nahi.
      //Check karna ki owner hi delete kar raha hai.
      //Tweet delete karna.
      //Delete operation successful hua ya nahi check karna.
      //Success response return karna.

    const { tweetId } = req.params;

    if(!tweetId){
        throw new ApiError(400, "tweetId is required");
    }

    const tweet = await Tweet.findById(tweetId);

    if(!tweet){
        throw new ApiError(404, "Tweet not found");
    }

    if(tweet.owner.toString() !== req.user._id.toString()){
        throw new ApiError(
            403,
            "You are not allowed to delete this tweet"
        );
    }

    const deletedTweet = await Tweet.findByIdAndDelete(tweetId);

    if(!deletedTweet){
        throw new ApiError(500, "Failed to delete tweet");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                deletedTweet,
                "Tweet deleted successfully"
            )
        );
})




export{
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet,
}