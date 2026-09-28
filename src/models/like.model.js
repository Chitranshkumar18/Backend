import mongoose,{Mongoose, Schema}  from "mongoose";

const likeSchema = Schema(
    {
        Comment:{
            type: Schema.Types.ObjectId,
            ref:"Comment"
        },
        video:{
            type: Schema.Types.ObjectId,
            ref:"Video"
        },
        likeBy:{
            type: Schema.Types.ObjectId,
            ref:"User"
        },
        tweet:{
            type: Schema.Types.ObjectId,
            ref:"Tweet"
        }

},
    {timestamps:true}
)

export const Like = Mongoose.model("Like", likeSchema)

