const {uploadPic, registerUser, loginUser} = require('./handler');

const routes =
[{
    method: 'POST',
    path: '/upload',
    options: {
        payload: {
            output: 'stream',
            parse: true,
            allow: 'multipart/form-data',
            multipart: true
        }
    },
    handler: uploadPic
},
{
    method: 'POST',
    path: '/register',
    handler: registerUser
},
{
    method: 'POST',
    path: '/login',
    handler: loginUser
}];

module.exports = routes;