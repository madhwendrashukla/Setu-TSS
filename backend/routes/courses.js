const express = require('express');
const router = express.Router();
const { listPublishedCourses, getCourseBySlug } = require('../utils/lmsDb');

// Public catalog of LMS-owned courses, read via the SELECT-only RDS role.
// Prices are in paise, exactly as the LMS stores them.

router.get('/', async (req, res) => {
  try {
    const courses = await listPublishedCourses();
    res.json(courses);
  } catch (error) {
    console.error('Error fetching LMS courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const course = await getCourseBySlug(req.params.slug);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    console.error('Error fetching LMS course:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

module.exports = router;
