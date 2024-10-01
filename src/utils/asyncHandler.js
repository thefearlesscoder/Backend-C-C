const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).
        catch ((error)  => next(error))
    }
}



export {asyncHandler}

// const asyncHandler = () => {}
// const asyncHandler = (func) => {() => {}}



// const asyncHandler = (func) => async(req,res,next) => {
//     try{
//         await func(req,res,next);
//     }catch(err){
//         req.status(err.code|| 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }