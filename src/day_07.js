/**
 * Contains solutions for Day 7
 * Puzzle Description: https://adventofcode.com/2022/day/7
 */

const parseLsResult = (line = '') => {
  const [lhs, rhs] = line.split(' ');
  return lhs === 'dir' ? rhs : +lhs;
};

const dirName = (parentDir, currentDir) => `${parentDir}_${currentDir}`;

const getDirectories = (lines) => {
  const directories = {
    '/': [],
  };

  const parentMap = {
    '/': null,
  };

  let currentDirectory = '/';

  for (let index = 2; index < lines.length; index++) {
    const line = lines[index];

    if (line[0] === '$') {
      // ignore ls commands
      if (line.length === 4) {
        continue;
      }
      // cd to the specified directory, either out (cd ..) or in (cd dirname)
      currentDirectory =
        line[5] === '.'
          ? parentMap[currentDirectory]
          : dirName(currentDirectory, line.slice(5));
    } else {
      let parsed = parseLsResult(line);
      if (typeof parsed === 'string') {
        parsed = dirName(currentDirectory, parsed);
        directories[parsed] = [];
        parentMap[parsed] = currentDirectory;
      }
      directories[currentDirectory].push(parsed);
    }
  }

  return directories;
};

const size = (directories, contents) =>
  contents.reduce((acc, x) => {
    if (typeof x === 'string') {
      return acc + size(directories, directories[x]);
    }

    return acc + x;
  }, 0);

const sumDirectories = (directories) =>
  Object.values(directories).reduce((acc, directory) => {
    const dirSize = size(directories, directory);

    if (dirSize <= 100000) {
      return acc + dirSize;
    }

    return acc;
  }, 0);

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = ({ lines }) => sumDirectories(getDirectories(lines));

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
