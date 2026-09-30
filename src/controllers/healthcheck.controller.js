import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const healthcheck = asyncHandler(async (req, res) => {
    // 1. Check karna server/application properly running hai.
    
    // 2. Health status ko response mein prepare karna.
    const healthStatus = {
        status: "OK"
    };

    // 3. Success response return karna.
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                healthStatus,
                "Server is healthy"
            )
        );
});

export{
    healthcheck
}