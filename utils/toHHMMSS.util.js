/**
 * @function
 * Converts a number of seconds to a formatted string of the format 'HH:MM:SS' if the number of seconds
 * exceed an hour, otherwise the format of the string will be 'MM:SS'.
 *
 * @param {number} seconds - The number of seconds to be formatted.
 * @returns {string} - The formatted time string.
 */
const toHHMMSS = (seconds) => {
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds - hours * 3600) / 60);
  let remainingSeconds = seconds - hours * 3600 - minutes * 60;

  // round remainingSeconds to 2 decimal places
  remainingSeconds = Math.round(remainingSeconds * 100) / 100;

  let formattedTime = '';
  if (hours > 0) {
    formattedTime = hours + ':';
    if (minutes < 10) {
      formattedTime += '0' + minutes + ':';
    } else {
      formattedTime += minutes + ':';
    }
    if (remainingSeconds < 10) {
      formattedTime += '0' + remainingSeconds;
    } else {
      formattedTime += remainingSeconds;
    }
  } else {
    if (minutes < 10) {
      formattedTime += '0' + minutes + ':';
    } else {
      formattedTime += minutes + ':';
    }
    if (remainingSeconds < 10) {
      formattedTime += '0' + remainingSeconds;
    } else {
      formattedTime += remainingSeconds;
    }
  }

  return formattedTime;
};

module.exports = toHHMMSS;
