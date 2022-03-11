
const { response } = require('express');
const DBUser = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');


const createUser = async(req, res = response ) => {

    const { name, email, password, fiatCurrency } = req.body;

    try {

        //Email verification
        let user = await DBUser.findOne({ email });

        if ( user ) {
            return res.status(400).json({
                ok: false,
                msg: 'User already exists'
            });
        }

        //Creating user with model
        user = new DBUser( req.body );

        //new user has no crypto
        user.cryptoCurrency = 0;

        //Password hash
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );

        //Json webtoken
        const token = await generateJWT( user.id, email );

        //Create UserDB
        await user.save();

        //Success request
        return res.status(201).json({
            ok: true,
            uid: user.id,
            name,
            fiatCurrency,
            cryptoCurrency: user.cryptoCurrency,
            token
        });

        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error creating Userdata'
        });
    }

}

const updateUser = async(req, res = response ) => {

    const { email, fiatCurrency, cryptoCurrency } = req.body;

    try {

        //email verification
        let user = await DBUser.findOne({ email });

        if ( !user ) {
            return res.status(400).json({
                ok: false,
                msg: 'User not valid'
            });
        }

        //Updating user currencies
        user.fiatCurrency = fiatCurrency;
        user.cryptoCurrency = cryptoCurrency;

        //Json webtoken
        const token = await generateJWT( user.uid, email);

        //Create UserDB
        await user.save();
        //await user.updateOne();

        //Success request
        return res.status(201).json({
            ok: true,
            uid: user.uid,
            name: user.name,
            email,
            fiatCurrency: user.fiatCurrency,
            cryptoCurrency: user.cryptoCurrency,
            token
        });

        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error updating Userdata'
        });
    }

}

const userLogin = async(req, res = response ) => {

    const { email, password } = req.body;

    try {

        //Email verification
        let user = await DBUser.findOne({ email });

        if ( !user ) {
            return res.status(400).json({
                ok: false,
                msg: 'User not valid'
            });
        }

        //Password verification
        const validPassword = bcrypt.compareSync( password, user.password);

        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'User not valid'
            });
        }

        //Json webtoken
        const token = await generateJWT( user.id, email );

        //Service answer
        return res.status(200).json({
            ok: true,
            uid: user.id,
            name: user.name,
            email,
            fiatCurrency: user.fiatCurrency,
            cryptoCurrency: user.cryptoCurrency,
            token
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Fatal login error'
        });
    }

}

const renewWebtoken = async(req, res = response ) => {

    const { uid, email } = req;

    let user = await DBUser.findOne({ email });

    //Json webtoken
    const token = await generateJWT( uid, email );

    return res.json({
        ok: true,
        uid,
        name: user.name,
        email: user.email,
        fiatCurrency: user.fiatCurrency,
        cryptoCurrency: user.cryptoCurrency,
        token,

    });

}


module.exports = {
    createUser,
    updateUser,
    userLogin,
    renewWebtoken
}