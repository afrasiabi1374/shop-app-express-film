import BaseController from "../core/BaseController.js";
import {validationResult,body} from 'express-validator';
import translate from "../core/translate.js";
import crypto from './../core/crypto.js';
import {random,stringify,log, getEnv} from './../core/utils.js';
import datetime from './../core/datetime.js';
import AdminModel from './../models/admin.js';

class HomeController extends BaseController
{
    #url =  getEnv('APP_URL') + 'home/';

    constructor()
    {
        super();
        this.model = null;

    }
    
    async getIndex(req,res){
        try{
            const data = {
                "title" : translate.t("home.page_title")
            }
            return res.render('home/index',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }






}


export default HomeController;