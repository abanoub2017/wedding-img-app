import axios from "axios";
const globalAxios = axios.create({
    baseURL: 'https://wedding-img-backend-production.up.railway.app/',
    // headers: {
    //   Authorization: hasToken ? `Bearer ${hasToken.token}` : '',
    //   "auth-token": hasToken ? `${hasToken.token}` : ''
    // },
});

export default globalAxios;