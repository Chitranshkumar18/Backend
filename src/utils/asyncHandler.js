
const asyncHandler =(requestHandler) => {
        return (req, res, next)=>{
            Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
        }
}


export {asyncHandler}






// const asyncHandler = () => async(req, res, next)=>{
//     try {
//          await requestHandler(req, res, next);
//     } catch (error) {
//         res.status(error.code || 500).json({
//             sucess: false,
//             message: error.message
//         })
//     }
// }

