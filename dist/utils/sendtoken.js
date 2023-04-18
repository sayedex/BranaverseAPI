
// Create Token and saving in cookie
Object.defineProperty(exports, "__esModule", { value: true });
const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();
    // options for cookie
    const options = {
        expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        // secure: true,

    };
    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user,
        token,
    });
};
exports.default = sendToken;
