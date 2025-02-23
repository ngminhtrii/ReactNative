import axios from 'axios';

const API_URL = 'http://192.168.2.70:5000';

const cloudinaryUpload = fileToUpload => {
  return axios
    .post(API_URL + '/uploads/cloudinary-upload', fileToUpload)
    .then(res => res.data)
    .catch(err => {
      console.error('Network error:', err);
      if (err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
        console.error('Response headers:', err.response.headers);
      } else if (err.request) {
        console.error('Request data:', err.request);
      } else {
        console.error('Error message:', err.message);
      }
      throw err;
    });
};

export default cloudinaryUpload;
