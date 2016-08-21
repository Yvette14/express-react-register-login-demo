import mongoose from 'mongoose';

module.exports = {
    connect: function () {
        mongoose.connect('mongodb://localhost/express-react-register-logIn-demo');
    },

    clone: function () {
        mongoose.connection.close();
    }
};