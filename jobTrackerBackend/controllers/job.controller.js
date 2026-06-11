const prisma = require('../prisma/client');

// GET ALL JOBS (for logged-in user only)
const getAllJobs = async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET ONE JOB BY ID
const getJobById = async (req, res) => {
  try {
    const job = await prisma.job.findFirst({
      where: { id: req.params.id, userId: req.user.userId },
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    res.status(200).json(job);
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// CREATE JOB
const createJob = async (req, res) => {
  try {
    const { company, role, location, salary, status, notes } = req.body;

    if (!company || !role) {
      return res.status(400).json({ message: 'Company and role are required.' });
    }

    const job = await prisma.job.create({
      data: {
        company,
        role,
        location: location || null,
        salary: salary || null,
        status: status || 'Applied',
        notes: notes || null,
        userId: req.user.userId,
      },
    });

    res.status(201).json(job);
  } catch (error) {
  console.error('Create job error:', error);
  res.status(500).json({ message: error.message });
}
};

// UPDATE JOB
const updateJob = async (req, res) => {
  try {
    // Check job belongs to this user
    const existing = await prisma.job.findFirst({
      where: { id: req.params.id, userId: req.user.userId },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    const { company, role, location, salary, status, notes } = req.body;

    const updated = await prisma.job.update({
      where: { id: req.params.id },
      data: {
        company: company ?? existing.company,
        role: role ?? existing.role,
        location: location ?? existing.location,
        salary: salary ?? existing.salary,
        status: status ?? existing.status,
        notes: notes ?? existing.notes,
      },
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// DELETE JOB
const deleteJob = async (req, res) => {
  try {
    // Check job belongs to this user
    const existing = await prisma.job.findFirst({
      where: { id: req.params.id, userId: req.user.userId },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    await prisma.job.delete({ where: { id: req.params.id } });

    res.status(200).json({ message: 'Job deleted successfully.' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getAllJobs, getJobById, createJob, updateJob, deleteJob };