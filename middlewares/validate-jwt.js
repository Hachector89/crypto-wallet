const { response } = require("express");
const jwt = require('jsonwebtoken');

const validateJWT = ( req, res = response, next ) => {

    const apiKey = req.header('x-api-key');

    if( !apiKey ){
        return res.status(401).json({
            ok: false,
            msg: 'Token error'
        });
    }

    try {

        const { uid, email } = jwt.verify( apiKey, process.env.SECRET_JWT_SEED );
        req.uid = uid;
        req.email = email;

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token not valid'
        });
    }
    
    // OK
    next();
}


module.exports = {
    validateJWT
}