/**
 * Contains solutions for Day 7
 * Puzzle Description: https://adventofcode.com/2022/day/7
 */

class Directory {
  #name;
  #parent;
  #contents = [];

  constructor(name, parent) {
    this.#name = name;
    this.#parent = parent;
  }
  get size() {
    return this.#contents.reduce((acc, x) => acc + x.size, 0);
  }

  get name() {
    return this.#name;
  }

  get parent() {
    return this.#parent;
  }

  get childDirs() {
    return this.#contents.filter((x) => x instanceof Directory);
  }

  addChild(item) {
    this.#contents.push(item);
  }

  getChildDir(dirName) {
    return this.#contents.find(({ name }) => name === dirName);
  }

  toString() {
    return `Directory - name: ${this.#name}, parent: ${
      this.#parent.name
    }, contents: [${this.#contents.map((x) => x.name).join(',')}]`;
  }
}

class File {
  #size = 0;
  #name;

  constructor(name, size) {
    this.#name = name;
    this.#size = size;
  }

  get size() {
    return this.#size;
  }

  get name() {
    return this.#name;
  }

  toString() {
    return `File - name: ${this.#name}, size: ${this.#size}`;
  }
}

/**
 * Parses the cd command and returns the new directory.
 * Can move in one level or out one level from the current directory.
 * @param {String} newDirName
 * @param {Directory} currentDir
 * @returns {Directory}
 */
const cd = (currentDir, newDirName) => {
  if (newDirName === '..') {
    return currentDir.parent;
  }

  return currentDir.getChildDir(newDirName);
};

/**
 * Parses a single line of output from the ls command.
 * @param {String} line
 * @param {Directory} parentDir
 * @returns {Directory|File}
 */
const parseLsResult = (lhs, rhs, parentDir) => {
  if (lhs === 'dir') {
    return new Directory(rhs, parentDir);
  }

  return new File(rhs, +lhs);
};

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = ({ input, lines }) => {
  const root = new Directory('/');
  let currentDirectory = root;

  for (let index = 2; index < lines.length; index++) {
    const split = lines[index].split(' ');

    if (split[0] === '$') {
      if (split.length === 2) {
        continue;
      }
      currentDirectory = cd(currentDirectory, split[2]);
    } else {
      const lsResult = parseLsResult(split[0], split[1], currentDirectory);
      currentDirectory.addChild(lsResult);
    }
  }

  const queue = [root];
  let total = 0;

  while (queue.length) {
    const current = queue.shift();

    if (current.size <= 100000) {
      total += current.size;
    }

    queue.push(...current.childDirs);
  }

  return total;
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
