/**
 * Invoke the function x number of times.
 * @param {Function} fn - The function to invoke each time, can return false to stop repeating early.
 * @param {Number} times
 */
export const repeat = (fn, times) => {
  if (times <= 0) {
    throw RangeError('times must be positive');
  }
  let remaining = times;
  while (remaining--) {
    if (fn() === false) {
      break;
    }
  }
};
