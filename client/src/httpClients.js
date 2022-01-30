import axios from "axios";


export default axios.create({
    withCredentials: true // for using the cookies
})