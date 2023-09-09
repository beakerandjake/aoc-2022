/**
 * FIFO Queue
 */
export class Queue {
  #head;
  #tail;
  #length = 0;

  /**
   * Creates a new queue populated with the initial items.
   * @param  {...any} items - The items to initially populate the queue with.
   */
  constructor(...items) {
    this.push(...items);
  }

  /**
   * Push the items on to the back of the queue.
   * @param  {...any} items - The item(s) to push on to the array.
   * @returns {Number} - The size of the queue after the operation.
   */
  push(...items) {
    items.forEach((element) => {
      this.#pushSingleItem(element);
    });
    return this.#length;
  }

  /**
   * Adds the element to the queue and returns the new queue length.
   */
  #pushSingleItem(element) {
    const node = { element, next: undefined };

    if (!this.#tail) {
      this.#head = node;
      this.#tail = node;
    } else {
      this.#tail.next = node;
      this.#tail = node;
    }

    return ++this.#length;
  }

  /**
   * Shifts off the item at the front of the queue.
   * If the queue is empty, undefined is returned.
   * @returns {any|undefined}
   */
  shift() {
    if (!this.#head) {
      return undefined;
    }
    const toReturn = this.#head;
    this.#head = this.#head.next;
    if (!this.#head) {
      this.#tail = undefined;
    }
    this.#length--;
    return toReturn.element;
  }

  /**
   * Number of elements in the queue.
   */
  get length() {
    return this.#length;
  }
}
