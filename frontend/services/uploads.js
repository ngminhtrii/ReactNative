import axios from 'axios';

const API_URL = 'http://192.168.1.2.5000';

const cloudinaryUpload = fileToUpload => {
  return axios
    .post(API_URL + '/uploads/cloudinary-upload', fileToUpload)
    .then(res => res.data)
    .catch(err => console.log(err));
};

export default cloudinaryUpload;
