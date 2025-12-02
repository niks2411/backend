const express = require('express');
const Joi = require('joi');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();

const taskSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  description: Joi.string().allow('', null),
  status: Joi.string().valid('todo', 'in-progress', 'done')
});

router.use(auth);

router.get('/', async (req, res) => {
  const { search, status } = req.query;
  const filter = { user: req.user.id };

  if (status) filter.status = status;
  if (search) {
    filter.title = { $regex: search, $options: 'i' };
  }

  try {
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json({ tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  const { error } = taskSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const task = await Task.create({ ...req.body, user: req.user.id });
    res.status(201).json({ task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  const { error } = taskSchema.min(1).validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


