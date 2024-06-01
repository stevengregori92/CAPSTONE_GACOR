const {uploadPic, registerUser, loginUser, deleteUser, updateUser, getDoctors} = require('./handler');

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
},{
    method: 'PATCH',
    path: '/update',
    handler: updateUser
},{
    method: 'GET',
    path: '/doctors',
    handler: getDoctors
}];

module.exports = routes;