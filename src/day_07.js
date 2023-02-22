/**
 * Contains solutions for Day 7
 * Puzzle Description: https://adventofcode.com/2022/day/7
 */

const parseLsResult = (line = '') => {
  const [lhs, rhs] = line.split(' ');
  return lhs === 'dir' ? rhs : +lhs;
};

const addDirectory = (directories, newDirName) => ({ ...directories, [newDirName]: [] });

const updateParentMap = (parentMap, newDirName, parentDir) => ({
  ...parentMap,
  [newDirName]: parentDir,
});

const addToDirectory = (directories, dirName, item) => ({
  ...directories,
  [dirName]: [...directories[dirName], item],
});

const size = (directories, contents) =>
  contents.reduce((acc, x) => {
    if (typeof x === 'string') {
      return acc + size(directories, directories[x]);
    }

    return acc + x;
  }, 0);

const sumDirectories = (directories) => {
  console.log(directories);
  return Object.values(directories).reduce((acc, directory) => {
    const dirSize = size(directories, directory);

    if (dirSize <= 100000) {
      return acc + dirSize;
    }

    return acc;
  }, 0);
};

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = ({ input, lines }) => {
  let directories = {
    '/': [],
  };

  let parentMap = {
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
          : `${currentDirectory}_${line.slice(5)}`;
    } else {
      const parsed = parseLsResult(line);
      if (typeof parsed === 'string') {
        const dirName = `${currentDirectory}_${parsed}`;
        directories = addDirectory(directories, dirName);
        parentMap = updateParentMap(parentMap, dirName, currentDirectory);
        directories = addToDirectory(directories, currentDirectory, dirName);
      } else {
        directories = addToDirectory(directories, currentDirectory, parsed);
      }
    }
  }
  // console.log(directories);
  return sumDirectories(directories);
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
