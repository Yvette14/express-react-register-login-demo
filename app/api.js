'use strict';
import express from 'express';
import _ from 'lodash';
import sha1 from 'sha1';
import {User} from './db/schema';
const router = express.Router();

router.post('/users', function (req, res, next) {
    const {username, password} = req.body;
    new User({username, password}).save((err)=> {
        if (err) return next(err);
        return res.sendStatus(201);
    });
});

router.post('/sessions', function (req, res, next) {
    const {username, password} = req.body;
    User.findOne({username, password}, function (err, user) {
        if (err) return next(err);
        if (user !== null) {
            res.cookie('token', generateToken(username, password));
            return res.sendStatus(201);
        }
        return res.sendStatus(401);
    });
});

router.get('/personal', function (req, res,next) {
    const token = req.cookies['token'];
    const username = getUsernameFromToken(token);
    User.findOne({username}, function (err, user) {
        if (err) return next(err);
        if (user !== null&&(generateToken(user.username, user.password) === token)) {
            return res.json({username, greeting: 'Hello, logged user!'});
        }
        res.sendStatus(401);
    });
});

function generateToken(username, password) {
    return username + ':' + sha1(password);
}

function getUsernameFromToken(token) {
    const separatorIndex = _.lastIndexOf(token, ':');
    return token.substring(0, separatorIndex);
}

export default router;