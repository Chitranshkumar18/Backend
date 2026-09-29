import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError} from "../utils/ApiError.js"
import { ApiResponse} from "../utils/ApiResponse.js"
import { Video} from "../models/video.model.js"
import { Comment } from "../models/comments.model.js"
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



export{
    createTweet,
    

}