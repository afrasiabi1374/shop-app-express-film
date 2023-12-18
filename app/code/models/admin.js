import {MongoDB} from '../global.js';
import AdminSchema from './../schemas/admin.js';
import {log} from './../core/utils.js';
import datetime from './../core/datetime.js';
import crypto from './../core/crypto.js';

class AdminModel
{
    constructor(){
        this.model = MongoDB.db.model('admin', AdminSchema);
    }

    #hashPassword(password,user_id){
        return crypto.hash(user_id + password + user_id);
    }

    async login(email,password){
        const result = await this.model.findOne({"email":email});
        if(result?._id)
        {   
            const user_id = result?._id+'';

            if(this.#hashPassword(password,user_id) === result?.password)
            {
                if(result?.status === 2)
                {
                    return user_id;//login success
                }
                else
                {   
                    switch(result?.status)
                    {
                        case 0:
                            return -2;//account is disabled 
                        case 1:
                            return -3;//account is blocked
                    }
                }
            }
            else
            {
                return -1;//email or password is not correct
            }
        }
        else
        {
            return -1;//email or password is not correct
        }
    }
 
}



export default AdminModel;