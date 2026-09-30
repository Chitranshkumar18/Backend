import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {User} from "../models/user.model.js"

const toggleSubscription = asyncHandler(async(req,res)=>{
    // 1. channelId lena.
    // 2. Check karna channelId provided hai.
    // 3. Logged-in user ki ID lena.
    // 4. Check karna user logged-in hai.
    // 5. Channel/User database se find karna.
    // 6. Check karna channel exist karta hai ya nahi.
    // 7. Check karna user khud ko subscribe na kar raha ho.
    // 8. Check karna subscription already exist karti hai ya nahi.
    // 9. Agar subscription exist karti hai:
    //    - Subscription delete karna.
    //    - Unsubscribed response return karna.
    // 10. Agar subscription exist nahi karti:
    //    - New subscription create karna.
    //    - Subscribed response return karna.
    // 1. channelId lena.
    const {channelId} = req.params;

    // 2. Check karna channelId provided hai.
    if(!channelId) {
        throw new ApiError(400,"Channel id is required");
    }
    
    // 3. Logged-in user ki ID lena.
    const userId = req.user?._id;

    // 4. Check karna user logged-in hai.
    if(!userId){
        throw new ApiError(401, "User is not logged in");
    }

    // 5. Channel/User database se find karna.
    const channel = await User.findById(channelId);

    // 6. Check karna channel exist karta hai ya nahi.
    if(!channel){
        throw new ApiError(404, "Channel not found");
    }

    // 7. Check karna user khud ko subscribe na kar raha ho.
    if(channelId.toString() === userId.toString()){
        throw new ApiError(400, "User cannot subscribe to itself");
    }

    // 8. Check karna subscription already exist karti hai ya nahi.
    const subscription = await Subscription.findOne({
        subscriber: userId,
        channel: channelId
    });

    // 9. Agar subscription exist karti hai:
    //    - Subscription delete karna.
    //    - Unsubscribed response return karna.
    if(subscription){
        const deletedSubscription =
            await Subscription.findByIdAndDelete(subscription._id);

        if(!deletedSubscription){
            throw new ApiError(
                500,
                "Something went wrong while unsubscribing"
            );
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                null,
                "Channel unsubscribed successfully"
            )
        );
    }

    // 10. Agar subscription exist nahi karti:
    //     - New subscription create karna.
    //     - Subscribed response return karna.
    const newSubscription = await Subscription.create({
        subscriber: userId,
        channel: channelId
    });

    if(!newSubscription){
        throw new ApiError(
            500,
            "Something went wrong while subscribing"
        );
    }

    return res.status(201).json(
        new ApiResponse(
            201,
            newSubscription,
            "Channel subscribed successfully"
        )
    );
})


const getUserChannelSubscribers = asyncHandler(async(req,res)=>{
    // 1. channelId lena.
    // 2. Check karna channelId provided hai.
    // 3. Channel/User database se find karna.
    // 4. Check karna channel exist karta hai ya nahi.
    // 5. Subscription database se find karna jahan:
    //    - channel = channelId
    // 6. Subscribers ko populate karna.
    // 7. Check karna subscribers mile hain ya nahi.
    // 8. Subscribers list return karna.
    const {channelId} = req.params
    if(!channelId){
        throw new ApiError(403, " Channel ID is required ")
    }

    const channel = await User.findById(channelId);
    if(!channel){
        throw new ApiError(404, " Channel is not found ")
    }

    const subscribers = await Subscription.find({
        channel: channelId     
    }).populate("subscriber")

    if(subscribers.length === 0){
        throw new ApiError (404," Channel has no subscribers ")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            subscribers,
            "Subscribers fetched successfully"
        ))
})


const getSubscribedChannels = asyncHandler(async(req,res)=>{
    // 1. Logged-in user ki ID lena.
    // 2. Check karna user logged-in hai.
    // 3. Subscription database se find karna jahan:
    //    - subscriber = logged-in user ID
    // 4. Subscribed channels ko populate karna.
    // 5. Check karna subscribed channels mile hain ya nahi.
    // 6. Subscribed channels list return karna.

    const userId = req.user?._id
    if(!userId){
        throw new ApiError (403," User ID is required ")
    }

    const subscribedChannels = await Subscription.find({
        subscriber: userId
    }).populate("channel")

    if(subscribedChannels.length === 0){
        throw new ApiError(404, "User has no subscribed channels")
    }
    
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            subscribedChannels,
            "Subscribed channels fetched successfully"
        )
    )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}