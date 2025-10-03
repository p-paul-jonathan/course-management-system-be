'use strict';

/**
 * Returns the current time as a Date object.
 */
function calculateCurrentTime() {
  return new Date();
}

/**
 * Adds an offset (in minutes) to a given time.
 *
 * @param {number} timeInMinutes - Number of minutes to add (can be negative).
 * @param {Date} [baseTime] - Optional base time (defaults to now).
 * @returns {Date} - New Date with offset applied.
 */
function calculateOffsetTime(timeInMinutes, baseTime = calculateCurrentTime()) {
  const offsetMillis = timeInMinutes * 60 * 1000;
  return new Date(baseTime.getTime() + offsetMillis);
}

module.exports = {
  calculateCurrentTime,
  calculateOffsetTime,
};
