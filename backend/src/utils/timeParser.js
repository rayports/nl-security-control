const chrono = require('chrono-node');

/**
 * Parse a time expression into a Date object
 * Supports sophisticated expressions like "this weekend", "next tuesday 5pm", "next christmas"
 * @param {string} text - Time expression to parse
 * @param {Date} referenceDate - Optional reference date (defaults to now)
 * @returns {Date|null} - Parsed date or null if invalid
 */
const parseTime = (text, referenceDate = new Date()) => {
  if (!text || typeof text !== 'string') {
    return null;
  }

  const trimmed = text.trim();
  if (!trimmed) {
    return null;
  }

  // Handle "this weekend" - returns Saturday 00:00:00
  const thisWeekendMatch = trimmed.match(/^this\s+weekend$/i);
  if (thisWeekendMatch) {
    const saturday = getThisWeekendStart(referenceDate);
    return saturday;
  }

  // Handle "next weekend" - returns next Saturday 00:00:00
  const nextWeekendMatch = trimmed.match(/^next\s+weekend$/i);
  if (nextWeekendMatch) {
    const nextSaturday = getNextWeekendStart(referenceDate);
    return nextSaturday;
  }

  // Handle "next christmas" - chrono-node may not parse this reliably
  const nextChristmasMatch = trimmed.match(/^next\s+christmas$/i);
  if (nextChristmasMatch) {
    const now = new Date(referenceDate);
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-11
    const currentDate = now.getDate();
    
    // If we're past December 25 this year, return next year's Christmas
    // Otherwise return this year's Christmas
    let christmasYear = currentYear;
    if (currentMonth > 11 || (currentMonth === 11 && currentDate > 25)) {
      christmasYear = currentYear + 1;
    }
    
    const christmas = new Date(christmasYear, 11, 25, 0, 0, 0, 0); // December 25
    return christmas;
  }

  // Use chrono-node for standard parsing (handles "next tuesday 5pm", etc.)
  const parsed = chrono.parseDate(trimmed, referenceDate);
  
  if (parsed) {
    return parsed;
  }

  return null;
};

/**
 * Get the start of this weekend (Saturday 00:00:00)
 * @param {Date} referenceDate - Reference date
 * @returns {Date} - Saturday of current or next week
 */
const getThisWeekendStart = (referenceDate) => {
  const date = new Date(referenceDate);
  const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
  
  // If it's already Saturday or Sunday, return next Saturday
  // Otherwise, return this Saturday
  let daysUntilSaturday = (6 - dayOfWeek) % 7;
  if (daysUntilSaturday === 0 && dayOfWeek !== 6) {
    daysUntilSaturday = 7; // Next Saturday if it's Sunday
  }
  if (daysUntilSaturday === 0) {
    daysUntilSaturday = 7; // Next Saturday if it's already Saturday
  }
  
  date.setDate(date.getDate() + daysUntilSaturday);
  date.setHours(0, 0, 0, 0);
  return date;
};

/**
 * Get the start of next weekend (next Saturday 00:00:00)
 * @param {Date} referenceDate - Reference date
 * @returns {Date} - Next Saturday
 */
const getNextWeekendStart = (referenceDate) => {
  const date = new Date(referenceDate);
  const dayOfWeek = date.getDay();
  
  // Always get the Saturday after the upcoming Saturday
  let daysUntilSaturday = (6 - dayOfWeek) % 7;
  if (daysUntilSaturday === 0) {
    daysUntilSaturday = 7;
  }
  daysUntilSaturday += 7; // Add another week for "next" weekend
  
  date.setDate(date.getDate() + daysUntilSaturday);
  date.setHours(0, 0, 0, 0);
  return date;
};

/**
 * Parse a weekend range ("this weekend" or "next weekend")
 * Returns start (Saturday 00:00) and end (Sunday 23:59:59)
 * @param {string} text - Weekend expression
 * @param {Date} referenceDate - Optional reference date
 * @returns {{start: Date, end: Date}|null} - Weekend range or null
 */
const parseWeekendRange = (text, referenceDate = new Date()) => {
  if (!text || typeof text !== 'string') {
    return null;
  }

  const trimmed = text.trim().toLowerCase();
  
  if (trimmed === 'this weekend') {
    const saturday = getThisWeekendStart(referenceDate);
    const sunday = new Date(saturday);
    sunday.setDate(sunday.getDate() + 1);
    sunday.setHours(23, 59, 59, 999);
    return { start: saturday, end: sunday };
  }
  
  if (trimmed === 'next weekend') {
    const saturday = getNextWeekendStart(referenceDate);
    const sunday = new Date(saturday);
    sunday.setDate(sunday.getDate() + 1);
    sunday.setHours(23, 59, 59, 999);
    return { start: saturday, end: sunday };
  }
  
  return null;
};

module.exports = {
  parseTime,
  parseWeekendRange
};

