import BaseController from "../core/BaseController.js";
class Error404Controller extends BaseController
{
    constructor()
    {
        super();
    }

    async handle(req,res)
    {
        try{
            return res.status(404).render('404.html');
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }
}


export default Error404Controller;