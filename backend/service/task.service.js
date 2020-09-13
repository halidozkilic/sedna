const express = require('express');
const TaskModel = require('../mongo-model/task.model');
const authorization = require('../middleware/check-auth');

const router = express.Router();

router.post('/createTask', authorization, (request, response, next) => {
  const task = new TaskModel ({
    title: request.body.title,
    description: request.body.description
  });
  task.save().then(createdTask => {
    console.log(task);
    response.status(201).json({
      taskId: createdTask._id,
      message: 'Task added.',
      status: 0
    });
  });
});

router.put('/editTask/:id', authorization, (request, response, next) => {
  const task = new TaskModel ({
    _id: request.body.id,
    title: request.body.title,
    description: request.body.description
  });
  TaskModel.updateOne({_id: request.params.id}, task).then(result => {
    console.log(result);
    response.status(200).json({message: 'Update successful!'});
  })
});

router.get('/tasks', authorization, (request, response, next) => {
  TaskModel.find().then((documents) => {
    response.status(200).json({
      message: 'Successfully',
      status: 1,
      tasks: documents
    });
  });
});

router.delete('/tasks/:id', authorization, (request, response, next) => {
  TaskModel.deleteOne({_id: request.params.id}).then(result => {
    console.log(result);
    response.status(200).json({
      message: 'Task deleted!',
      status: 2
    });
  });
});

module.exports = router;
