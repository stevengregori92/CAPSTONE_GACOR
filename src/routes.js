const {uploadPic, registerUser, loginUser, deleteUser} = require('./handler');

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
},{
    method: 'DELETE',
    path: '/delete',
    handler: deleteUser
}];

module.exports = routes;