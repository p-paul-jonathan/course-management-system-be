'use strict';

const db = require('../config/database');
const { PER_PAGE } = require('../constants');
const { dbLogger } = require('../services/db');
const { chapterCreationValidator, chapterUpdationValidator, chapterDeletionValidator } = require('../validators/chapter');
const { findWithPagination } = require('./concerns/pagination');
const { calculateCurrentTime } = require('./concerns/time');
const Course = require('./course');

module.exports.findByCourseId = async (courseId, page = 1, per = PER_PAGE) => {
  const chapterOrder = await findChapterOrder(courseId)
  const chaptersData = await findWithPagination(
    'chapters',
    `
      course_id = $1
      AND id = ANY($2)
    `,
    [courseId, chapterOrder],
    page,
    per,
    'array_position($2, id)'
  )

  return chaptersData;
};


module.exports.find = async (id, withCourse = false) => {
  const query = `
    SELECT *
    FROM chapters
    WHERE id = $1
  `;
  const variables = [id];

  dbLogger(query, variables, 'Find Chapter');

  const result = await db.query(query, variables);
  const chapter = result.rows[0] || null;

  if (!chapter) { return; }
  if (!withCourse) { return chapter; }

  const course = await Course.find(chapter.course_id, true);
  chapter.course = course;

  return chapter;
}

module.exports.create = async ({ title, content, courseId }, userId) => {
  const errors = await chapterCreationValidator({ title, content, courseId, userId });

  if (errors.length != 0) {
    return { errors };
  }

  const currentTime = calculateCurrentTime();

  const query = `
    INSERT INTO chapters (title, content, created_at, updated_at, course_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const variables = [title, content, currentTime, currentTime, courseId];

  dbLogger(query, variables, 'Create Chapter');

  const result = await db.query(query, variables);
  const chapter = result.rows[0];

  await addChapterToCourse(chapter.id, courseId, errors);

  return { chapter, errors }
};

module.exports.update = async ({ id, title, content, courseId }, userId) => {
  const errors = await chapterUpdationValidator({ id, title, content, courseId, userId });

  if (errors.length != 0) {
    return { errors };
  }

  const query = `
    UPDATE chapters
    SET title = $1, content = $2, updated_at = $3
    WHERE id = $4
    RETURNING *
  `;
  const variables = [title, content, calculateCurrentTime(), id];

  dbLogger(query, variables, 'Update Chapter');

  const result = await db.query(query, variables);
  const chapter = result.rows[0] || null;

  return { chapter, errors }
};

module.exports.destroy = async (id, courseId, userId) => {
  const errors = await chapterDeletionValidator({ id, courseId, userId });

  if (errors.length != 0) {
    return { errors }
  }

  const query = `
    DELETE FROM chapters
    WHERE id = $1
    RETURNING *
  `;
  const variables = [id];

  dbLogger(query, variables, 'Delete Chapter');

  const result = await db.query(query, variables);
  const chapter = result.rows[0] || null;

  await removeChapterFromCourse(id, courseId, errors);

  return { chapter, errors: [] };
};

async function addChapterToCourse(id, courseId, errors) {
  const query = `
    UPDATE courses
    SET chapter_order = array_append(chapter_order, $1)
    WHERE id = $2
  `;
  const variables = [id, courseId];

  dbLogger(query, variables, 'Add chapter to course');

  const result = await db.query(query, variables);

  if (result.rowCount == 0) {
    errors.push({
      code: 500,
      message: 'Error Occured while associating chapter with course',
      location: 'title'
    });
  }
}

async function removeChapterFromCourse(id, courseId, errors) {
  const query = `
    UPDATE courses
    SET chapter_order = array_remove(chapter_order, $1)
    WHERE id = $2
  `;
  const variables = [id, courseId];

  dbLogger(query, variables, 'Remove Chapter from Course');

  const result = await db.query(query, variables);

  if (result.rowCount == 0) {
    errors.push({
      code: 500,
      message: 'Error Occured while removing chapter from course',
      location: 'title'
    });
  }
}

async function findChapterOrder(courseId) {
  const query = `
    SELECT chapter_order
    FROM courses
    WHERE id = $1
  `;
  const variables = [courseId];
  dbLogger(query, variables, 'Fetch Chapter Order');

  const result = await db.query(query, variables);

  if (result.rowCount == 0) { return []; }

  return result.rows[0].chapter_order;
}

