import {log,getEnv,random} from './core/utils.js';
import express from 'express';
import nunjucks from 'nunjucks';
import Error500 from './controllers/Error500Controller.js';
import Error404 from './controllers/Error404Controller.js';
import translate from './core/translate.js';
import {MongoDB, Redis} from './global.js';
import * as templateHelper from './core/TemplateHelper.js';
import TemplateReqMiddleware from './middlewares/template-req.js';
import FileUploadMiddleware from './middlewares/fileupload.js';
import SessionMiddleware from './middlewares/session.js';

class Application
{
    #app = null;
    #templateEngine = null;

    async #initExpress()
    {
        try{
            this.#app = express();
            this.#app.use(express.static('assets'));
            this.#app.use(express.static('media'));
            this.#app.use(express.urlencoded({extended:true,limit:'10mb'}));
            this.#app.use(express.json({limit:'10mb'}));
            this.#app.use(new SessionMiddleware().handle);
            this.#app.use(new FileUploadMiddleware().handle);
            this.#app.use(new TemplateReqMiddleware().handle);
            this.#initTemplateEngine();
        }
        catch(e){
            log(`Error on : initExpress ${e.toString()}`);
        }   
    }

    async #initRoute()
    {
        try{
            const route = await import('./routes/route.js');
            this.#app.use('/',route.default);
            this.#app.use(new Error404().handle);
            this.#app.use(new Error500().handle);        
        }
        catch(e){
            log(`Error on : initRoute ${e.toString()}`);
        }
    }


    #initTemplateEngine(){
        try{
            const templateDir = 'templates/' + getEnv('TEMPLATE') + '/'; 
            this.#templateEngine = nunjucks.configure(templateDir,{
                autoescape : true,
                express : this.#app,
                noCache : false,
            });
            this.#app.set('view engine', 'html');
            this.#templateEngine.addGlobal('t',translate.t);
            this.#templateEngine.addGlobal('getEnv',getEnv);
            this.#templateEngine.addGlobal('asset_lang_url',(path = '') => { 
                return getEnv('ASSET_DIRECTORY') + '/lang/' + getEnv('APP_LANG') + '/' + path
            });
            this.#templateEngine.addGlobal('APP_URL',getEnv('APP_URL'));
            this.#templateEngine.addGlobal('TEMPLATE_NAME',getEnv('TEMPLATE')+'/');    
            this.#templateEngine.addGlobal('asset_url',(path = '')=>{ return getEnv('ASSET_DIRECTORY') + '/' + path; });
            this.#templateEngine.addExtension('alertDangerExtension',new templateHelper.alertDangerExtension());
            this.#templateEngine.addExtension('alertSuccessExtension',new templateHelper.alertSuccessExtension());
        }
        catch(e){
            log(`Error on : initTemplateEngine ${e.toString()}`);
        }
    }


    async #init(){
        const redisStatus =  await Redis.connect(getEnv('REDIS_URI'));
        if(!redisStatus)
        {
            log('Redis Can not Connect');
            process.exit(-1);
        }

        const mongodbStatus = await MongoDB.connect(getEnv('MONGODB_URI'));
        if(!mongodbStatus)
        {
            log(`monogdb Can not Connect!`);
            process.exit(-1);
        }

        await this.#initExpress();
        await this.#initRoute();
        await Redis.ftCreate('user','user:','id TEXT SORTABLE username TEXT SORTABLE password TEXT SORTABLE age TEXT SORTABLE');
    }

    async run()
    {
        try{
            log(`Application is run!`);
            await this.#init();
            const PORT = getEnv('PORT','number');
            this.#app.listen(PORT,async() => {
                log(`app listening on port ${PORT}`);
            });    
        }
        catch(e){
            log(`Error on : run ${e.toString()}`);
        }
    }

}


export default Application;