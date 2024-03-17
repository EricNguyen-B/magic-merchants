import axios from "axios";
import * as ENV from '../utils/Environment';

async function registerUser(accountData: FormData): Promise<boolean>{
    try{
        let data = await axios.post(`${ENV.getServerURL()}/api/register`, {
            email: accountData.get('email'),
            username: `${accountData.get('firstName')} ${accountData.get('lastName')}`,
            password: accountData.get('password')
        }, {withCredentials: true});
        if (data.status === 201){
            console.log("User Registration Success");
            return true;
        }
        else{
            console.log("User Registration Failed");
            return false;
        }
    }catch(error){
        console.log("Registration Failed: Error occurred during registration:", error);
        return false;
    }
}
async function authenticateUser(credentials: FormData): Promise<boolean>{
    try{
        let data = await axios.post(`${ENV.getServerURL()}/api/login`, {
          email: credentials.get('email'),
          password: credentials.get('password')
        }, {withCredentials: true});
        if (data.status === 200){
            console.log("User Authentication Success");
            return true;
        }
        else{
            console.log("User Authentication Failed");
            return false;
        }
    }catch(error){
        console.log("Login Failed: Error occurred during authentication:", error);
        return false;
    }
}
async function logoutUser(): Promise<boolean>{
    try{
        let data = await axios.post(`${ENV.getServerURL()}/api/logout`, {withCredentials: true});
        console.log(data.status)
        if (data.status === 200){
            console.log("Logout Success");
            return true;
        }
        else{
            console.log("Logout Failed");
            return false;
        }
    }catch(error){
        return false;
    }
}
async function authenticateCookie(): Promise<boolean>{
    try{
        let data = await axios.get(`${ENV.getServerURL()}/api/authCookie`, {withCredentials: true});
        if (data.status === 200){
            console.log("Cookie Authentication Success");
            return true;
        }
        else{
            console.log("Cookie Authentication Failed");
            return false;
        }
    }catch(error){
        console.log("Error occurred during authentication:", error);
        return false; 
    }
}

export {authenticateCookie, authenticateUser, registerUser, logoutUser};