import { writeFile } from 'node:fs/promises';
import { EOL } from 'node:os';

/**
 * Write the array of data to a file.
 * @param {Array} array - The array of data to save to a file.
 * @param {String} fileName - The path to save the file to.
 * @param {String} separator - String used to separate each item in the array.
 */
export const writeArrayToFile = async (array, fileName, separator = EOL) =>
  writeFile(fileName, array.join(separator));
