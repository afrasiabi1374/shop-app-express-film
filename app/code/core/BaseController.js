import autoBind from 'auto-bind';
import { getEnv,log,toNumber } from './utils.js';
import {encode} from 'html-entities';


export default class BaseController
{
    constructor()
    {
        if(this.constructor === BaseController)
        {
            throw new Error(`BaseController is abstract class!`);
        }
        autoBind(this);

    }

    toError(error,req,res)
    {
        const debug = getEnv('DEBUG','bool');
        try{
            if(debug)
                return res.status(500).render('500',{"error":error.toString()});
            else
                return res.status(500).render('500',{"error":"Internal Server Error"});
        }
        catch(e){
            if(debug)
                return res.status(500).render('500',{"error":e.toString()});
            else
                return res.status(500).render('500',{"error":"Internal Server Error"});
        }
    }

    errorHandling(error)
    {
        try{
            const debug = getEnv('DEBUG','bool');
            return async (req, res, next) => {
                if(debug)
                    return res.status(500).render('500',{"error":error.toString()});
                else
                    return res.status(500).render('500',{"error":"Internal Server Error"});
            };        
        }
        catch(e){
            throw e;
        }
    }


    input(field)
    {
        try{
            if(!Array.isArray(field))
            {
                if(typeof field === 'string')
                        return field.trim();
                else
                    return '';
            }
            else    
                return '';
        }
        catch(e){
            return '';
        }
    }


    safeString(str){
        try{
            return encode(str);
        }
        catch(e){
            return '';
        }
    }

    toNumber(str){
        return toNumber(str);
    }


}