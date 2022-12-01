import { GetToken } from "../Utils/other/GetSaveToken";
import { adress } from "./apiAdress";
import { LoginData } from "./loginUp";

export async function authUp():Promise<LoginData|'notoken'>{
    let token = GetToken();
    if (token==='none') return 'notoken';
    
    try{
        let apiadress=adress+`/api/auth`;
        let res = await fetch(apiadress,{
            method:'POST',
            headers:{
                'authorization': token,
            },
        })
        let json:LoginData= await res.json();
        return json;
    }catch{
        return 'notoken';
    }   
}