
// const ENV_MODE:string = import.meta.env.VITE_REACT_PORT;
// const PROD_URL:string = import.meta.env.VITE_REACT_PROD_URL;
// const DEV_URL:string = import.meta.env.VITE_REACT_DEV_URL;

/***
 * This is a temporary solution until I can manage to get the ENV variables 
 * working during deployment with Netlify
 * ***/
const ENV_MODE:string = "DEV";
const PROD_URL:string = "https://magic-merchants-16edcf281bcc.herokuapp.com";
const DEV_URL:string = "http://localhost:8000"

export function getServerURL():string{
    return (ENV_MODE === "PROD") ? PROD_URL : DEV_URL;
}