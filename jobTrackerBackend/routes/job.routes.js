const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth.middleware');
const { getAllJobs, getJobById, createJob, updateJob, deleteJob } = require('../controllers/job.controller');

router.use(auth);

router.get('/', getAllJobs);
router.get('/:id', getJobById);
router.post('/', createJob);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);

module.exports = router;
