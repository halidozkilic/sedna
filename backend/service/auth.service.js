const express = require('express');
const UserModel = require('../mongo-model/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/signup', (request, response, next) => {
  console.log(request.body.password);
  bcrypt.hash(request.body.password, 10)
    .then(hash => {
      const user = new UserModel({
        email: request.body.email,
        password: hash
      });
      user.save()
        .then(result => {
          response.status(201).json({
            message: 'User created!',
            result: result
          });
        })
        .catch(err => {
          response.status(500).json({
            error: err
          });
        });
    });
});

router.post('/login', (request, response, next) => {
  let fetchedUser;
  UserModel.findOne({ email: request.body.email }).then(user => {
    if(!user) {
      return response.status(401).json({ message: 'Auth failed!' });
    }
    fetchedUser = user;
    return bcrypt.compare(request.body.password, user.password);
  }).then(result => {
    if(!result) {
      return response.status(401).json({ message: 'Auth failed!' });
    }
    const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id}, 'e8dy65uEaMcRxE7uasjo213dajksb', {expiresIn: '1h'});
    response.status(200).json({
      token: token,
      expiresIn: 3600
    });
  }).catch(err => {
    return response.status(401).json({ message: 'Auth failed!' });
  })
})

module.exports = router;
