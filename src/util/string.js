/**
 * Converts the string to a number.
 * For speed not for sanity, this can easily fail if the string is not valid.
 * @param {String} x
 */
export const toNumber = (x) => +x;

/**
 * Returns an array of all lowercase alphabet characters in order from a-z.
 */
export const lowercaseAlphabet = () =>
  [...Array(26)].map((_, index) => String.fromCharCode(index + 97));

/**
 * Match the string to the regex and return the first capture result.
 * @param {String} str
 * @param {RegExp} regex
 */
export const firstCapture = (str, regex) => str.match(regex)[1];

/**
 * Returns true if the string is a single digit character
 * @param {String} char
 */
export const isDigitCharacter = (char) => /^\d$/.test(char);
