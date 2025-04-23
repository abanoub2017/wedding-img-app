import axios from "axios";
const globalAxios = axios.create({
    baseURL: 'https://wedding-img-backend-production.up.railway.app/',


});

export default globalAxios;