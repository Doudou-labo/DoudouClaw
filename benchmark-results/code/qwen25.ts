/**
 * Interval Tree Implementation
 * 
 * A self-balancing AVL-based interval tree that supports efficient
 * interval storage, querying, and management with O(log n + k) operations.
 * 
 * Each node is augmented with maxEnd to enable pruning during search.
 */

export interface Interval<T> {
  start: number;
  end: number;
  value: T;
}

interface IntervalNode<T> {
  interval: Interval<T>;
  left: IntervalNode<T> | null;
  right: IntervalNode<T> | null;
  height: number;
  maxEnd: number;
}

export class IntervalTree<T> {
  private root: IntervalNode<T> | null = null;
  private _size: number = 0;

  /**
   * Get the number of intervals in the tree
   */
  get size(): number {
    return this._size;
  }

  /**
   * Check if the tree is empty
   */
  get isEmpty(): boolean {
    return this._size === 0;
  }

  /**
   * Insert a new interval into the tree
   * Time complexity: O(log n)
   */
  insert(start: number, end: number, value: T): void {
    if (start >= end) {
      throw new Error(`Invalid interval: [${start}, ${end}). Start must be less than end.`);
    }
    this.root = this._insert(this.root, start, end, value);
    this._size++;
  }

  private _insert(
    node: IntervalNode<T> | null,
    start: number,
    end: number,
    value: T
  ): IntervalNode<T> {
    if (node === null) {
      return {
        interval: { start, end, value },
        left: null,
        right: null,
        height: 1,
        maxEnd: end,
      };
    }

    // Standard BST insertion based on start value
    if (start < node.interval.start) {
      node.left = this._insert(node.left, start, end, value);
    } else {
      node.right = this._insert(node.right, start, end, value);
    }

    // Update height and maxEnd
    node.height = 1 + Math.max(this._getHeight(node.left), this._getHeight(node.right));
    node.maxEnd = Math.max(
      node.interval.end,
      Math.max(this._getMaxEnd(node.left), this._getMaxEnd(node.right))
    );

    // Rebalance if needed
    const balance = this._getBalance(node);

    // Left Left Case
    if (balance > 1 && start < node.left!.interval.start) {
      return this._rotateRight(node);
    }

    // Right Right Case
    if (balance < -1 && start >= node.right!.interval.start) {
      return this._rotateLeft(node);
    }

    // Left Right Case
    if (balance > 1 && start >= node.left!.interval.start) {
      node.left = this._rotateLeft(node.left!);
      return this._rotateRight(node);
    }

    // Right Left Case
    if (balance < -1 && start < node.right!.interval.start) {
      node.right = this._rotateRight(node.right!);
      return this._rotateLeft(node);
    }

    return node;
  }

  /**
   * Delete an interval from the tree
   * Time complexity: O(log n)
   */
  delete(start: number, end: number, value?: T): boolean {
    const initialSize = this._size;
    this.root = this._delete(this.root, start, end, value);
    return this._size < initialSize;
  }

  private _delete(
    node: IntervalNode<T> | null,
    start: number,
    end: number,
    value?: T
  ): IntervalNode<T> | null {
    if (node === null) {
      return null;
    }

    // Navigate to find the node to delete
    if (start < node.interval.start) {
      node.left = this._delete(node.left, start, end, value);
    } else if (start > node.interval.start) {
      node.right = this._delete(node.right, start, end, value);
    } else {
      // Same start value, check end and optional value
      const endMatch = end === node.interval.end;
      const valueMatch = value === undefined || value === node.interval.value;

      if (endMatch && valueMatch) {
        // Found the node to delete
        this._size--;

        // Node with only one child or no child
        if (node.left === null) {
          return node.right;
        } else if (node.right === null) {
          return node.left;
        }

        // Node with two children: Get inorder successor
        const successor = this._getMinNode(node.right);
        node.interval = successor.interval;
        node.right = this._delete(node.right, successor.interval.start, successor.interval.end);
      } else {
        // Continue searching in both subtrees (duplicate starts possible)
        node.left = this._delete(node.left, start, end, value);
        if (this._size === node.left ? this._size : this._size) {
          node.right = this._delete(node.right, start, end, value);
        }
      }
    }

    // If tree had only one node
    if (node === null) {
      return null;
    }

    // Update height and maxEnd
    node.height = 1 + Math.max(this._getHeight(node.left), this._getHeight(node.right));
    node.maxEnd = Math.max(
      node.interval.end,
      Math.max(this._getMaxEnd(node.left), this._getMaxEnd(node.right))
    );

    // Rebalance
    const balance = this._getBalance(node);

    // Left Left
    if (balance > 1 && this._getBalance(node.left) >= 0) {
      return this._rotateRight(node);
    }

    // Left Right
    if (balance > 1 && this._getBalance(node.left) < 0) {
      node.left = this._rotateLeft(node.left!);
      return this._rotateRight(node);
    }

    // Right Right
    if (balance < -1 && this._getBalance(node.right) <= 0) {
      return this._rotateLeft(node);
    }

    // Right Left
    if (balance < -1 && this._getBalance(node.right) > 0) {
      node.right = this._rotateRight(node.right!);
      return this._rotateLeft(node);
    }

    return node;
  }

  /**
   * Search for all intervals containing a point
   * Time complexity: O(log n + k) where k is the number of results
   */
  search(point: number): Interval<T>[] {
    const results: Interval<T>[] = [];
    this._search(this.root, point, results);
    return results;
  }

  private _search(node: IntervalNode<T> | null, point: number, results: Interval<T>[]): void {
    if (node === null) return;

    // Pruning: if point > maxEnd in this subtree, no intervals can contain it
    if (point > node.maxEnd) return;

    // Search left subtree first (intervals with smaller starts)
    if (node.left !== null && point < node.maxEnd) {
      this._search(node.left, point, results);
    }

    // Check current node
    if (point >= node.interval.start && point < node.interval.end) {
      results.push(node.interval);
    }

    // Search right subtree if point could be in intervals there
    // Optimization: only go right if point >= current start (intervals there could contain it)
    // or if there's a chance of overlap
    if (node.right !== null && point >= node.interval.start) {
      this._search(node.right, point, results);
    }
  }

  /**
   * Search for all intervals overlapping with a query interval [start, end)
   * Time complexity: O(log n + k) where k is the number of results
   */
  searchInterval(start: number, end: number): Interval<T>[] {
    const results: Interval<T>[] = [];
    this._searchInterval(this.root, start, end, results);
    return results;
  }

  private _searchInterval(
    node: IntervalNode<T> | null,
    start: number,
    end: number,
    results: Interval<T>[]
  ): void {
    if (node === null) return;

    // Pruning: if query starts after maxEnd, no overlap possible in this subtree
    if (start >= node.maxEnd) return;

    // Check left subtree
    if (node.left !== null) {
      this._searchInterval(node.left, start, end, results);
    }

    // Check current node for overlap
    // Two intervals [a, b) and [c, d) overlap if a < d && c < b
    if (node.interval.start < end && start < node.interval.end) {
      results.push(node.interval);
    }

    // Check right subtree only if query end > current start
    if (node.right !== null && end > node.interval.start) {
      this._searchInterval(node.right, start, end, results);
    }
  }

  /**
   * Get all intervals in the tree (in-order traversal)
   * Time complexity: O(n)
   */
  getAll(): Interval<T>[] {
    const results: Interval<T>[] = [];
    this._inOrder(this.root, results);
    return results;
  }

  private _inOrder(node: IntervalNode<T> | null, results: Interval<T>[]): void {
    if (node === null) return;
    this._inOrder(node.left, results);
    results.push(node.interval);
    this._inOrder(node.right, results);
  }

  /**
   * Clear all intervals from the tree
   * Time complexity: O(1)
   */
  clear(): void {
    this.root = null;
    this._size = 0;
  }

  /**
   * Get the height of the tree (for debugging/testing)
   */
  getHeight(): number {
    return this._getHeight(this.root);
  }

  // Helper methods
  private _getHeight(node: IntervalNode<T> | null): number {
    return node?.height ?? 0;
  }

  private _getMaxEnd(node: IntervalNode<T> | null): number {
    return node?.maxEnd ?? -Infinity;
  }

  private _getBalance(node: IntervalNode<T> | null): number {
    if (node === null) return 0;
    return this._getHeight(node.left) - this._getHeight(node.right);
  }

  private _rotateRight(y: IntervalNode<T>): IntervalNode<T> {
    const x = y.left!;
    const T2 = x.right;

    // Perform rotation
    x.right = y;
    y.left = T2;

    // Update heights
    y.height = 1 + Math.max(this._getHeight(y.left), this._getHeight(y.right));
    x.height = 1 + Math.max(this._getHeight(x.left), this._getHeight(x.right));

    // Update maxEnd values
    y.maxEnd = Math.max(
      y.interval.end,
      Math.max(this._getMaxEnd(y.left), this._getMaxEnd(y.right))
    );
    x.maxEnd = Math.max(
      x.interval.end,
      Math.max(this._getMaxEnd(x.left), this._getMaxEnd(x.right))
    );

    return x;
  }

  private _rotateLeft(x: IntervalNode<T>): IntervalNode<T> {
    const y = x.right!;
    const T2 = y.left;

    // Perform rotation
    y.left = x;
    x.right = T2;

    // Update heights
    x.height = 1 + Math.max(this._getHeight(x.left), this._getHeight(x.right));
    y.height = 1 + Math.max(this._getHeight(y.left), this._getHeight(y.right));

    // Update maxEnd values
    x.maxEnd = Math.max(
      x.interval.end,
      Math.max(this._getMaxEnd(x.left), this._getMaxEnd(x.right))
    );
    y.maxEnd = Math.max(
      y.interval.end,
      Math.max(this._getMaxEnd(y.left), this._getMaxEnd(y.right))
    );

    return y;
  }

  private _getMinNode(node: IntervalNode<T>): IntervalNode<T> {
    while (node.left !== null) {
      node = node.left;
    }
    return node;
  }
}

export default IntervalTree;
