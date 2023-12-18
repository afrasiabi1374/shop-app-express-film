import { Router } from "express";
import {log} from '../core/utils.js';
import UserController from "../controllers/UserController.js";
import AuthMiddleware from '../middlewares/auth.js';
import RateLimitMiddleware from '../middlewares/ratelimit.js';
const controller = new UserController();
const route = Router();
try{
    route.get('/login',new AuthMiddleware().isAuth,controller.getLogin);
    route.post('/login',new AuthMiddleware().isAuth,controller.postLogin);
    route.get('/logout',new AuthMiddleware().needAuth,controller.getLogout);
    route.get('/profile',new AuthMiddleware().needAuth,controller.getProfile);
}
catch(e){
    route.use(controller.errorHandling(e.toString()));
}

export default route;

