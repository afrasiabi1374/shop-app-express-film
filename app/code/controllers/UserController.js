import BaseController from "../core/BaseController.js";
import {validationResult,body} from 'express-validator';
import translate from "../core/translate.js";
import crypto from './../core/crypto.js';
import {random,stringify,log, getEnv} from './../core/utils.js';
import datetime from './../core/datetime.js';
import AdminModel from './../models/admin.js';

class UserController extends BaseController
{
    #url =  getEnv('APP_URL') + 'user/';

    constructor()
    {
        super();
        this.model = new AdminModel();

    }
    
    async getLogin(req,res){
        try{
            const data = {
                "form_data" : req?.session?.user_login_data
            }
            return res.render('user/login',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }



    async postLogin(req,res){
        try{
            const email = this.safeString(this.input(req.body.email));
            const password = this.input(req.body.password);
            const formData = {email};
            req.session.user_login_data = formData;
            const result = await this.#loginValidation(req);
            if(!result.isEmpty())
            {
                return res.redirect(`${this.#url}login/?msg=${result?.errors[0]?.msg}`);
            }  
            const resultLogin = await this.model.login(email,password);
            if(typeof resultLogin === 'string')
            {
                req.session.admin_id = resultLogin;
                delete req.session.user_login_data;
                return res.redirect(getEnv('APP_URL'));
            }
            else
            {
                return res.redirect(`${this.#url}login/?msg=${resultLogin}`);
            }
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }

    async #loginValidation(req){
        await body('email').not().isEmpty().withMessage("err1")
            .isEmail().withMessage("err2")
            .run(req);
        await body('password').not().isEmpty().withMessage("err3").run(req);
        return validationResult(req);   
    }


    async getLogout(req,res){
        try{
            delete req.session.admin_id;
            req.session.destroy();
            return res.redirect(`${this.#url}login/?msg=success-logout`);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }


    async getProfile(req,res){
        try{
            const data = {
              "title" : translate.t('user.profile'),
            }
            return res.render('user/profile',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }


}


export default UserController;