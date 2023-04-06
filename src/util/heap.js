/**
 * Base class for a Min or a Max heap.
 */
export class Heap {
  _items = [];
  _maxIndex = 0;
  _indexMap = {};

  constructor(compareFn) {
    this._compareFn = compareFn;
  }

  /**
   * Returns the index of the nodes left child.
   */
  static _leftChild = (index) => index * 2;

  /**
   * Returns the index of the nodes right child.
   */
  static _rightChild = (index) => index * 2 + 1;

  /**
   * Returns the index of the nodes parent.
   */
  static _parent = (index) => Math.floor(index / 2);

  /**
   * Compare the two items using the heap comparison function.
   */
  _compare = (lhsIndex, rhsIndex) =>
    this._compareFn(this._items[lhsIndex].priority, this._items[rhsIndex].priority);

  /**
   * Swap elements in the heap.
   * This method modifies the heap.
   */
  _swap = (lhsIndex, rhsIndex) => {
    const lhsOrig = this._items[lhsIndex];
    const rhsOrig = this._items[rhsIndex];

    this._items[lhsIndex] = rhsOrig;
    this._items[rhsIndex] = lhsOrig;

    this._indexMap[lhsOrig.element] = rhsIndex;
    this._indexMap[rhsOrig.element] = lhsOrig;
  };

  /**
   * Bubble the element up the heap until the heap property is satisfied.
   */
  _bubbleUp = (index) => {
    let currentIndex = index;
    let parentIndex = Heap._parent(currentIndex);
    while (parentIndex >= 1 && this._compare(parentIndex, currentIndex) < 0) {
      this._swap(parentIndex, currentIndex);
      currentIndex = parentIndex;
      parentIndex = Heap._parent(currentIndex);
    }
  };

  /**
   * Bubble the element down the heap until the heap property is satisfied.
   */
  _bubbleDown = (index) => {
    let currentIndex = index;
    while (currentIndex <= this._maxIndex) {
      let swapIndex = currentIndex;

      const left = Heap._leftChild(currentIndex);
      if (left <= this._maxIndex && this._compare(swapIndex, left) < 0) {
        swapIndex = left;
      }

      const right = Heap._rightChild(currentIndex);
      if (right <= this._maxIndex && this._compare(swapIndex, right) < 0) {
        swapIndex = right;
      }

      if (swapIndex === currentIndex) {
        break;
      }

      this._swap(currentIndex, swapIndex);
      currentIndex = swapIndex;
    }
  };

  /**
   * Returns the head element of the heap.
   */
  peek = () => {
    if (this._maxIndex === 0) {
      return undefined;
    }
    return this._items[1];
  };

  /**
   * Adds a new element to the heap.
   */
  push(element, priority) {
    this._maxIndex += 1;
    this._items[this._maxIndex] = { element, priority };
    this._indexMap[element] = this._maxIndex;
    this._bubbleUp(this._maxIndex);
  }

  /**
   * Removes the head element from the heap and returns it.
   */
  pop() {
    if (this._maxIndex === 0) {
      return undefined;
    }
    const previousHead = this._items[1];
    delete this._indexMap[previousHead.element];

    const newHead = this._items.pop();
    this._maxIndex -= 1;
    this._items[1] = newHead;
    this._indexMap[newHead.element] = 1;
    this._bubbleDown(1);

    return previousHead;
  }

  update = (element, newPriority) => {
    const index = this._items.findIndex((x) => x?.element === element);

    if (index === -1) {
      return false;
    }

    // update the priority of the node.
    const oldPriority = this._items[index].priority;
    this._items[index].priority = newPriority;

    // move the node up or down the heap to satisfy the heap property.
    if (this._compareFn(oldPriority, newPriority) < 0) {
      this._bubbleUp(index);
    } else {
      this._bubbleDown(index);
    }

    return true;
  };

  /**
   * Does this heap have any elements?
   */
  isEmpty = () => this._maxIndex > 0;

  /**
   * Does this heap contain the specified element?
   */
  contains = (element) => !!this._indexMap[element];
}

/**
 * Comparison function which satisfies the max heap property.
 * @returns {Number} 1 if a should move towards the top of the heap, -1 if a should move towards the bottom, 0 if a and b are equal.
 */
const maxHeapCompare = (a, b) => {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
};

/**
 * Returns a new max heap, which keeps the max element at the top of the heap.
 */
export const maxHeap = () => new Heap(maxHeapCompare);

/**
 * Comparison function which satisfies the min heap property.
 * @returns {Number} 1 if a should move towards the top of the heap, -1 if a should move towards the bottom, 0 if a and b are equal.
 */
const minHeapCompare = (a, b) => {
  if (a > b) {
    return -1;
  }
  if (a < b) {
    return 1;
  }
  return 0;
};

/**
 * Returns a new min heap, which keeps the min element at the top of the heap.
 */
export const minHeap = () => new Heap(minHeapCompare);
