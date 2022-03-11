const { Router } = require('express');
const { check } = require('express-validator');
const { createUser, userLogin, renewWebtoken, updateUser } = require('../controllers/auth.controller');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

// new user
router.post( '/new', [
    check('email', 'Email is required and correctly formatted').isEmail(),
    check('password', 'Password is required and 6 character min lenght').isLength({ min:6 }),
    check('fiatCurrency', 'Fiat Currency is required and greater than 1').isFloat( {min: 1} ),
    validateFields
],  createUser );

//user update
router.post( '/update', [
    check('email', 'Email is required and correctly formatted').isEmail(),
    check('fiatCurrency', 'Fiat Currency is required as a number').isFloat({ min:0 }),
    check('cryptoCurrency', 'Crypto Currency is required as a number').isFloat( {min: 0} ),
    validateFields
],  updateUser );

// user login
router.post( '/', [
    check('email', 'Email is required and correctly formatted').isEmail(),
    check('password', 'Password is required and 6 character min lenght').isLength({ min:6 }),
    validateFields
], userLogin );

// user webtoken validation/renew
router.get( '/renew', validateJWT, renewWebtoken );





module.exports = router;