import { greaterThan, lessThan } from './logic.js';

/**
 * Returns the index which corresponds to the nodes left child.
 */
const leftChild = (index) => index * 2;

/**
 * Returns the index which corresponds to the nodes right child.
 */
const rightChild = (index) => index * 2 + 1;

/**
 * Returns the index of the nodes parent.
 */
const parent = (index) => Math.floor(index / 2);

/**
 * Returns the max index of the heap.
 */
const maxIndex = (heap) => heap.length - 1;

/**
 * Swap elements in the heap.
 * This method modifies the heap.
 */
const swap = (heap, lhsIndex, rhsIndex) => {
  const temp = heap[lhsIndex];
  // eslint-disable-next-line no-param-reassign
  heap[lhsIndex] = heap[rhsIndex];
  // eslint-disable-next-line no-param-reassign
  heap[rhsIndex] = temp;
};

const createHeapFunctions = (compareFn) => {
  const compare = (heap, lhsIndex, rhsIndex) =>
    compareFn(heap[lhsIndex].priority, heap[rhsIndex].priority);

  /**
   * Bubble the element up the heap until the heap property is satisfied.
   * This method modifies the heap.
   */
  const bubbleUp = (heap, index) => {
    let currentIndex = index;
    let parentIndex = parent(currentIndex);
    while (parentIndex >= 1 && compare(heap, parentIndex, currentIndex)) {
      swap(heap, parentIndex, currentIndex);
      currentIndex = parentIndex;
      parentIndex = parent(currentIndex);
    }
  };

  /**
   * Compares a node to its child and returns the index of the node
   * which satisfies the heap property.
   */
  const compareToChild = (heap, lastIndex, index, childIndex) =>
    childIndex <= lastIndex && compare(heap, index, childIndex) ? childIndex : index;

  /**
   * Bubble the element down the heap until the heap property is satisfied.
   * This method modifies the heap.
   */
  const bubbleDown = (heap, index) => {
    const lastIndex = maxIndex(heap);
    let currentIndex = index;
    while (currentIndex <= lastIndex) {
      let swapIndex = currentIndex;
      swapIndex = compareToChild(heap, lastIndex, swapIndex, leftChild(currentIndex));
      swapIndex = compareToChild(heap, lastIndex, swapIndex, rightChild(currentIndex));

      if (swapIndex === currentIndex) {
        break;
      }

      swap(heap, currentIndex, swapIndex);
      currentIndex = swapIndex;
    }
  };

  /**
   * Returns the head element of the heap.
   */
  const peek = (heap) => heap[1];

  /**
   * Adds a new element to the heap.
   * This method does not modify the heap but returns a new copy.
   */
  const push = (heap, item) => {
    // push item to end of heap
    const toReturn = heap.length ? [...heap, item] : [undefined, item];

    bubbleUp(toReturn, maxIndex(toReturn));
    return toReturn;
  };

  /**
   * Removes the head element of the heap.
   * This method does not modify the heap but returns a new copy.
   */
  const pop = (heap) => {
    if (heap.length <= 2) {
      return [];
    }

    // remove the head node and promote the last node to the head.
    const toReturn = [...heap];
    toReturn[1] = toReturn.pop();
    bubbleDown(toReturn, 1);

    return toReturn;
  };

  /**
   * Updates the priority of the element at the specified index.
   * This method does not modify the heap but returns a new copy.
   */
  const update = (heap, index, priority) => {
    const toReturn = [...heap];

    // update the priority of the node.
    const oldValue = toReturn[index].priority;
    toReturn[index].priority = priority;

    // move the node up or down the heap to satisfy the heap property.
    if (compareFn(oldValue, priority)) {
      bubbleUp(toReturn, index);
    } else {
      bubbleDown(toReturn, index);
    }

    return toReturn;
  };

  return {
    peek,
    pop,
    push,
    update,
  };
};

/**
 * Functions for working with a min heap.
 */
export const minHeap = createHeapFunctions(greaterThan);

/**
 * Functions for working with a max heap.
 */
export const maxHeap = createHeapFunctions(lessThan);
