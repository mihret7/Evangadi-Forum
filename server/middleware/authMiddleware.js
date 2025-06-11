const {StatusCodes}=require("http-status-codes")
const jwt =require("jsonwebtoken")
async function authMiddleware(req,res,next) {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer")){
        return res.status(StatusCodes.UNAUTHORIZED).json({error:"authentication invalid"})
    }
    const token =authHeader.split(" ")[1]
    console.log(authHeader)
    console.log(token)
    try {
        console.log("test 1");
        const {username,userid}= jwt.verify(token, process.env.JWT_SECRET)
        req.user={username,userid}
        console.log("test 2");
        console.log(username, userid);
        console.log("test 3");
        next()
    }catch (error){
        return res.status(StatusCodes.UNAUTHORIZED).json({error:"authorization invalid"})
    }
}
module.exports=authMiddleware