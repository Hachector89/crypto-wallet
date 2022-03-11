const jwt = require('jsonwebtoken');


const generateJWT = ( uid, email ) => {

    const payload = { uid, email };

    return new Promise( (resolve, reject) => {

        jwt.sign( payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '24h'
        }, (err, token) => {
    
            if(err){
                // KO
                console.log(err);
                reject( err );
            } else {
                // OK
                resolve( token );
            }
    
        });

    });

}


module.exports = {
    generateJWT
}