import express from 'express';
import * as ctrl from '../controllers/gameController.js';
import * as auth from '../controllers/authController.js';

const router = express.Router();

// Define routes
//router.get('/login', auth.login);
//router.post('/login', auth.verifyLogin);
//router.get('/register', auth.register);
//router.post('/register', auth.verifyRegister);
//router.get('/changePassword', auth.changePassword);
//router.post('/updatePassword', auth.updatePassword);
//router.post('/toggleUserRole', auth.toggleUserRole);
//router.get('/logout', auth.logout);

//router.get('/', auth.isAuthenticated, ctrl.home);
router.get('/', ctrl.home);
router.post('/newPlayer', ctrl.addPlayer);
router.post('/selectPlayer', ctrl.selectPlayer);
           
export default router;
