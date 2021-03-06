const {jwtVerifyAsync} = require('./../utils/jwtAsync');
const customError = require('../utils/customError');
const {secretKey} = require('../utils/globalVariablesAndFunctions');



const adminTokenValidatorMiddleware = async (req, res, next) => {
    //Apply on any method except for GET method
    if(req.method == 'GET' && req.originalUrl !== '/admin'){
        next();
        return;
    }
    const token = req.headers.token;
    try{
        const decoded = await jwtVerifyAsync(token, secretKey);
        req.adminId = decoded.id;
        if(decoded.isAdmin){
            req.isAdmin = true;
            req.isActive = decoded.isActive;
            next();
        }else{
            throw customError(401, '401 Unauthorized', 'Not Authrized');
        }
    }catch(error){
        if(!error.status){
            error = customError(401, 'NOT_AUTHRIZED', 'Not an authrized user');
        }
        next(error);
    }
}

module.exports = {adminTokenValidatorMiddleware};