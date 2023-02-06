const jwt = require("jsonwebtoken")
function generateAccessToken (userEmail) {

    const t = jwt.sign( { user_id: 2, userEmail} ,
    process.env.ACCESS_TOKEN_SECRET , 
    {expiresIn: "15m"});
    console.log("t",t)
return t

}
module.exports = generateAccessToken