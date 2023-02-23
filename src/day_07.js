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
 */
const dirName = (parentDirName, currentDirName) => `${parentDirName}_${currentDirName}`;

/**
 * Parses the cd command and returns the new dir relative to the current dir.
 * @param {Object} parentMap
 * @param {String} currentDirName
 * @param {String} command
 * @returns {String}
 */
const cd = (parentMap, currentDirName, command) =>
  command[5] === '.'
    ? parentMap[currentDirName]
    : dirName(currentDirName, command.slice(5));

/**
 * Parses a line from the LS command.
 * The line can either represent a directory or file.
 * If the line is a dir, then the dir name is returned.
 * Otherwise the line is a file, and the file size is returned.
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
 */
const isDir = (item) => typeof item === 'string';

/**
 * Parses each line of the puzzle input and returns the Directory Map,
 * maps the name of each directory to the content of that directory.
 * @param {String[]} lines
 * @returns {Object} Object which maps each dir name to its contents.
 */
const parseInput = (lines) => {
  const dirs = {
    [ROOT]: [],
  };
  const parentMap = {
    [ROOT]: null,
  };
  let currentDirName = ROOT;

  for (let index = 2; index < lines.length; index++) {
    const line = lines[index];

    if (line[0] === '$') {
      // only care about cd commands, ignore ls which always has length of 4.
      if (line.length > 4) {
        currentDirName = cd(parentMap, currentDirName, line);
      }
    } else {
      // if its not a command its output from the ls command, add to the current dir.
      let item = parseLsResult(line);
      if (isDir(item)) {
        item = dirName(currentDirName, item);
        dirs[item] = [];
        parentMap[item] = currentDirName;
      }
      dirs[currentDirName].push(item);
    }
  }
  return dirs;
};

/**
 * Calculates the size of the given dir.
 * @param {Object} dirs
 * @param {Array} dir
 * @returns {Number}
 */
const dirSize = (dirs, dir) =>
  dir.reduce((total, x) => (isDir(x) ? total + dirSize(dirs, dirs[x]) : total + x), 0);

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) => {
  const dirs = parseInput(lines);
  return Object.values(dirs).reduce((total, contents) => {
    const size = dirSize(dirs, contents);
    return size <= 100000 ? total + size : total;
  }, 0);
};

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ lines }) => {
  const dirs = parseInput(lines);

  // calculate and store the size of each directory.
  const dirSizes = Object.entries(dirs).reduce((acc, [name, contents]) => {
    acc[name] = dirSize(dirs, contents);
    return acc;
  }, {});

  // find the minimum amount of space to delete  in order to reach the target free space.
  const target = 30000000 - (70000000 - dirSizes[ROOT]);

  // find the smallest dir size needed to reach the target.
  return Object.values(dirSizes).reduce(
    (smallest, size) => (size >= target && size < smallest ? size : smallest),
    Number.MAX_SAFE_INTEGER
  );
};
