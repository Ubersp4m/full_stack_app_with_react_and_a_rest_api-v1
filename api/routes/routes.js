const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');
const { User, Course } = require('../models');
const { authenticateUser } = require('../middleware/auth-user');

// Construct a router instance.
const router = express.Router();

// Route that returns an authenticated user
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;
  res.json({
    id: user.id,
    firstName: user.firstName, 
    lastName: user.lastName,
    emailAddress: user.emailAddress,
    password: user.password,
  })
}));

//Get all courses and  display in json
router.get('/courses', asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt']},
        include:[{
            model: User,
            attributes: {
                exclude: ['id', 'password', 'createdAt', 'updatedAt']
            }
        }]
    });
    res.status(200).json({courses});    
}));

//Get a course by :id and display it in json
router.get('/courses/:id', asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id, {
        attributes: { exclude: ['createdAt', 'updatedAt']},
        include:[{
            model: User,
            attributes: {
                exclude: ['id', 'password', 'createdAt', 'updatedAt']
            }
        }]
    });
    if(course){
        res.status(200).json({course});
    }else{
        let error = new Error('course not found');
        error.status = 404;
        throw error;
    }
}));

// Create a new user
router.post('/users', asyncHandler(async (req, res) => {
    await User.create(req.body);
    res.location('/');
    res.sendStatus(201).end();
}));

// Create a new course using POST request
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
    const newCourse = await Course.create(req.body);
    res.location(`/api/courses/${newCourse.id}`);
    res.sendStatus(201).end();
}));

//update courses using PUT request
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    const user = req.currentUser;
    if(course){
        if(user.id === course.userId){
            await course.update(req.body);
            res.status(204).end();
        }else{
            res.status(403).json({ message: 'Forbidden' })
        }
    }else{
        let err = new Error('Course not found');
        err.status=400;
        throw err;
    }
}));

//Delete course using DELETE request on a specific course :id
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    const user = req.currentUser;
    if(course){
        if(user.id === course.userId){
            await course.destroy();
            res.status(204).end();
        }else{
            res.status(403).json({ message: 'Forbidden' })
        }
    }else{
        let err = new Error('Course not found');
        err.status=400;
        throw err;
    }
}));



module.exports = router;