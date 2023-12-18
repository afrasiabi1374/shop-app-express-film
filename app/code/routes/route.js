import { Router } from "express";
import userRoute from './user.js';
import homeRoute from './home.js';
import {log} from '../core/utils.js';
const route = Router();
route.use('/',homeRoute);
route.use('/user/',userRoute);
export default route;    