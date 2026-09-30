import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler.js";    


const getChannelStats = asyncHandler(async(req,res)=>{
    // 1. Logged-in user ki ID lena.
    // 2. Check karna user logged-in hai.
    // 3. User ke channel ke videos database se find karna.
    // 4. Total videos count karna.
    // 5. User ke channel ke subscribers count karna.
    // 6. Videos par total views calculate karna.
    // 7. Videos ke likes count karna.
    // 8. Required statistics ko ek object mein store karna.
    // 9. Channel statistics return karna.

    // 1. Logged-in user ki ID lena.
    const userId = req.user?._id;

    // 2. Check karna user logged-in hai.
    if(!userId){
        throw new ApiError(401, "User is not logged in");
    }

    // 3. User ke channel ke videos database se find karna.
    const videos = await Video.find({
        owner: userId
    });

    // 4. Total videos count karna.
    const totalVideos = videos.length;

    // 5. User ke channel ke subscribers count karna.
    const totalSubscribers = await Subscription.countDocuments({
        channel: userId
    });

    // 6. Videos par total views calculate karna.
    const totalViews = videos.reduce(
        (total, video) => total + (video.views || 0),
        0
    );

    // 7. Videos ke likes count karna.
    const totalLikes = await Like.countDocuments({
        video: { $in: videos.map(video => video._id) }
    });

    // 8. Required statistics ko ek object mein store karna.
    const stats = {
        totalVideos,
        totalSubscribers,
        totalViews,
        totalLikes
    };

    // 9. Channel statistics return karna.
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                stats,
                "Channel statistics fetched successfully"
            )
        );
})


const getChannelVideos = asyncHandler(async(req,res)=>{

        //  1. Logged-in user ki ID lena.
        // 2. Check karna user logged-in hai.
        // 3. Database se current user ke videos find karna.
        // 4. Videos ko required fields ke saath populate karna.
        // 5. Videos ko latest first sort karna.
        // 6. Check karna videos mile hain ya nahi.
        // 7. Channel videos return karna.

        // 1. Logged-in user ki ID lena.
    const userId = req.user?._id;

    // 2. Check karna user logged-in hai.
    if(!userId){
        throw new ApiError(401, "User is not logged in");
    }

    // 3. Database se current user ke videos find karna.
    const videos = await Video.find({
        owner: userId
    })

    // 4. Videos ko required fields ke saath populate karna.
    .populate("owner", "username avatar")

    // 5. Videos ko latest first sort karna.
    .sort({ createdAt: -1 });

    // 6. Check karna videos mile hain ya nahi.
    if(videos.length === 0){
        throw new ApiError(404, "No videos found");
    }

    // 7. Channel videos return karna.
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                videos,
                "Channel videos fetched successfully"
            )
        );
})


export{
    getChannelStats,
    getChannelVideos
}