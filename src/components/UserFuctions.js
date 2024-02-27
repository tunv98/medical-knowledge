import axios from 'axios';
import { Base64 } from 'js-base64';
import jwt_decode from 'jwt-decode';
import { duration } from 'moment';

export const encode = keySearch =>{
   try {
       if(keySearch) {
           const key = Base64.encode(keySearch);
           return key;
       }
   }
   catch (e) {
       console.log(e);
   }
};
export const decode = key =>{
    try{
        if(key){
            const keySearch = Base64.decode(key);
            return keySearch;
        }
    }
    catch (e) {
        console.log(e)
    }
};

// export const getListAudio = key =>{
//   try {
//       if(key){
//           return axios
//               .get(`/api/searchdt?key=${key}`,{
//               })
//               .then(res => {
//                   return res.data;
//               })
//               .catch(e => {
//                   console.log(e);
//               })
//       }
//   }
//   catch (e) {
//       console.log(e);
//   }
// };
export const addAudio = (arr) =>{
    try {
        const formData = new FormData();
        formData.append('title', arr.title);
        formData.append('author', arr.author);
        formData.append('position', arr.position);
        formData.append('file', arr.file);
        formData.append('date', arr.date);
        formData.append('link', arr.link);
        formData.append('status', arr.status);
        formData.append('user_id', arr.user_id);
        return axios({
            url: "/api/adddt",
            method: 'POST',
            data: formData,
            headers: {
                'content-type': 'multipart/form-data'
            }
        })
        .then(res => {
            return res;
        })
        .catch(e => {
            console.log(e);
        })
    }
    catch (e) {
        console.log(e)
    }
}

export const register = newUser => {
    try {
        return axios
        .post('/api/users/register', {
            firstname: newUser.firstname,
            lastname: newUser.lastname,
            email: newUser.email,
            password: newUser.password
        })
        .then(res => {
            return res;
        })
        .catch(e => {
            console.log(e);
        })
    }
    catch (e) {
        console.log(e)
    }
}

export const login = user => {
    return axios
    .post('/api/users/login', {
        email: user.email,
        password: user.password
    })
    .then(res => {
        return res.data
    })
    .catch(err => {
        console.log(err);
    })
}
export const getIdToken = token => {
    try {
        if(token) {
            const decoded = jwt_decode(token);
            return decoded.identity.id;
        }else
            return -1;
    }
    catch (e) {
        console.log(e);
    }
}
export const getFirstnameToken = token => {
    try {
        if(token) {
            const decoded = jwt_decode(token);
            return decoded.identity.firstname;
        }else
            return -1;
    }
    catch (e) {
        console.log(e);
    }
} 