/**
 * Contains solutions for Day 7
 * Puzzle Description: https://adventofcode.com/2022/day/7
 */

/**
 * The root dir name
 */
const ROOT = '/';

/**
 * Returns a unique name to the current dir.
 * Fixes edge cases where a dir name is non-unique.
 * @param {String} parentDirName
 * @param {String} currentDirName
 * @returns
 */
const dirName = (parentDirName, currentDirName) => `${parentDirName}_${currentDirName}`;

/**
 * Parses the cd command and returns the new dir relative to the current dir.
 * @param {Object} parentMap
 * @param {String} currentDirName
 * @param {String} command
 * @returns {String} - The name of the new current dir.
 */
const cd = (parentMap, currentDirName, command) =>
  command[5] === '.'
    ? parentMap[currentDirName]
    : dirName(currentDirName, command.slice(5));

/**
 * Parses a line from the LS command.
 * The line can either represent a directory or file.
 * If the line is a dir, then the dir name is returned.
 * Otherwise the line is a file, and the file size is
 * @param {String} line
 * @returns {String|Number}
 */
const parseLsResult = (line = '') => {
  const [lhs, rhs] = line.split(' ');
  return lhs === 'dir' ? rhs : +lhs;
};

/**
 * Returns whether or not the item is a directory.
 * @param {String|Number} item
 * @returns {Boolean}
 */
const isDir = (item) => typeof item === 'string';

/**
 * Parses each line of the puzzle input and returns the Directory Map,
 * maps the name of each directory to the content of that directory.
 * @param {String[]} lines
 * @returns {Object}
 */
const parseInput = (lines) => {
  const directories = {
    [ROOT]: [],
  };

  const parentMap = {
    [ROOT]: null,
  };

  let currentDirectory = ROOT;

  for (let index = 2; index < lines.length; index++) {
    const line = lines[index];

    if (line[0] === '$') {
      // ignore ls commands which always have length === 4
      if (line.length > 4) {
        currentDirectory = cd(parentMap, currentDirectory, line);
      }
    } else {
      let parsed = parseLsResult(line);
      if (isDir(parsed)) {
        parsed = dirName(currentDirectory, parsed);
        directories[parsed] = [];
        parentMap[parsed] = currentDirectory;
      }
      directories[currentDirectory].push(parsed);
    }
  }

  return directories;
};

/**
 * Calculates the size of the given directory.
 * @param {Object} dirMap
 * @param {Array} dir
 * @returns {Number}
 */
const dirSize = (dirMap, dir) =>
  dir.reduce((acc, x) => (isDir(x) ? acc + dirSize(dirMap, dirMap[x]) : acc + x), 0);

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = ({ lines }) => {
  const directories = parseInput(lines);
  return Object.values(directories).reduce((total, directory) => {
    const size = dirSize(directories, directory);
    return size <= 100000 ? total + size : total;
  }, 0);
};

/**
 * Returns the solution for level two of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelTwo = ({ input, lines }) => {
  // your code here
};
