import axios from "axios";
const instance=axios.create({
   
        baseURL:'https://api.counvo.in/'
        // baseURL:'http://localhost:5000/'

       
})
export default instance;