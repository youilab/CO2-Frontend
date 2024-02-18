import axios from 'axios'; 

const axiosClient = axios.create({
    //baseURL: 'http://localhost:3005/'

    baseURL: '/co2-bkn'
})


axiosClient.interceptors.request.use(
    async(config)=>{
        const token = localStorage.getItem("token");
        if (token) {
            config.headers['x-token'] =token
        }
        return config
    }
)

export default axiosClient; 