/**
 * Generic Interval Tree Implementation
 * Supports insert, remove, and search(point) operations
 */

export interface Interval {
  low: number;
  high: number;
}

export interface IntervalNode<T> {
  interval: Interval;
  value: T;
  max: number;
  left: IntervalNode<T> | null;
  right: IntervalNode<T> | null;
  height: number;
}

export class IntervalTree<T> {
  private root: IntervalNode<T> | null = null;
  private size: number = 0;

  /**
   * Insert an interval with associated value into the tree
   */
  insert(low: number, high: number, value: T): void {
    const interval: Interval = { low: Math.min(low, high), high: Math.max(low, high) };
    this.root = this.insertNode(this.root, interval, value);
    this.size++;
  }

  private insertNode(node: IntervalNode<T> | null, interval: Interval, value: T): IntervalNode<T> {
    if (node === null) {
      return {
        interval,
        value,
        max: interval.high,
        left: null,
        right: null,
        height: 1
      };
    }

    if (interval.low < node.interval.low) {
      node.left = this.insertNode(node.left, interval, value);
    } else {
      node.right = this.insertNode(node.right, interval, value);
    }

    // Update height and max
    node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
    node.max = Math.max(
      node.interval.high,
      node.left?.max ?? -Infinity,
      node.right?.max ?? -Infinity
    );

    // Rebalance
    return this.rebalance(node);
  }

  /**
   * Remove an interval from the tree
   */
  remove(low: number, high: number): boolean {
    const interval: Interval = { low: Math.min(low, high), high: Math.max(low, high) };
    const originalSize = this.size;
    this.root = this.removeNode(this.root, interval);
    return this.size < originalSize;
  }

  private removeNode(node: IntervalNode<T> | null, interval: Interval, isReplacement: boolean = false): IntervalNode<T> | null {
    if (node === null) {
      return null;
    }

    if (interval.low < node.interval.low) {
      node.left = this.removeNode(node.left, interval);
    } else if (interval.low > node.interval.low) {
      node.right = this.removeNode(node.right, interval);
    } else if (interval.low === node.interval.low && interval.high === node.interval.high) {
      // Found the node to remove
      if (!isReplacement) {
        this.size--;
      }

      if (node.left === null) {
        return node.right;
      }
      if (node.right === null) {
        return node.left;
      }

      // Node with two children: get inorder successor
      const successor = this.getMinNode(node.right);
      node.interval = successor.interval;
      node.value = successor.value;
      node.right = this.removeNode(node.right, successor.interval, true);
    } else {
      // Same low but different high, continue searching
      node.right = this.removeNode(node.right, interval);
    }

    if (node === null) {
      return null;
    }

    // Update height and max
    node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
    node.max = Math.max(
      node.interval.high,
      node.left?.max ?? -Infinity,
      node.right?.max ?? -Infinity
    );

    return this.rebalance(node);
  }

  /**
   * Search for all intervals containing a given point
   */
  search(point: number): T[] {
    const results: T[] = [];
    this.searchPoint(this.root, point, results);
    return results;
  }

  private searchPoint(node: IntervalNode<T> | null, point: number, results: T[]): void {
    if (node === null) {
      return;
    }

    // Check if point is within current interval
    if (point >= node.interval.low && point <= node.interval.high) {
      results.push(node.value);
    }

    // Search left subtree if it might contain overlapping intervals
    if (node.left !== null && node.left.max >= point) {
      this.searchPoint(node.left, point, results);
    }

    // Search right subtree if it might contain overlapping intervals
    if (node.right !== null && point >= node.interval.low) {
      this.searchPoint(node.right, point, results);
    }
  }

  /**
   * Get all intervals overlapping with a given interval
   */
  searchInterval(low: number, high: number): T[] {
    const results: T[] = [];
    const query: Interval = { low: Math.min(low, high), high: Math.max(low, high) };
    this.searchIntervalOverlap(this.root, query, results);
    return results;
  }

  private searchIntervalOverlap(node: IntervalNode<T> | null, query: Interval, results: T[]): void {
    if (node === null) {
      return;
    }

    // Check overlap
    if (query.low <= node.interval.high && query.high >= node.interval.low) {
      results.push(node.value);
    }

    // Search left subtree
    if (node.left !== null && node.left.max >= query.low) {
      this.searchIntervalOverlap(node.left, query, results);
    }

    // Search right subtree
    if (node.right !== null && query.high >= node.interval.low) {
      this.searchIntervalOverlap(node.right, query, results);
    }
  }

  /**
   * Get the size of the tree
   */
  getSize(): number {
    return this.size;
  }

  /**
   * Check if tree is empty
   */
  isEmpty(): boolean {
    return this.root === null;
  }

  /**
   * Clear the tree
   */
  clear(): void {
    this.root = null;
    this.size = 0;
  }

  // Helper methods for AVL balancing
  private getHeight(node: IntervalNode<T> | null): number {
    return node?.height ?? 0;
  }

  private getBalance(node: IntervalNode<T>): number {
    return this.getHeight(node.left) - this.getHeight(node.right);
  }

  private rotateRight(y: IntervalNode<T>): IntervalNode<T> {
    const x = y.left!;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    y.height = 1 + Math.max(this.getHeight(y.left), this.getHeight(y.right));
    x.height = 1 + Math.max(this.getHeight(x.left), this.getHeight(x.right));

    y.max = Math.max(
      y.interval.high,
      y.left?.max ?? -Infinity,
      y.right?.max ?? -Infinity
    );
    x.max = Math.max(
      x.interval.high,
      x.left?.max ?? -Infinity,
      x.right?.max ?? -Infinity
    );

    return x;
  }

  private rotateLeft(x: IntervalNode<T>): IntervalNode<T> {
    const y = x.right!;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    x.height = 1 + Math.max(this.getHeight(x.left), this.getHeight(x.right));
    y.height = 1 + Math.max(this.getHeight(y.left), this.getHeight(y.right));

    x.max = Math.max(
      x.interval.high,
      x.left?.max ?? -Infinity,
      x.right?.max ?? -Infinity
    );
    y.max = Math.max(
      y.interval.high,
      y.left?.max ?? -Infinity,
      y.right?.max ?? -Infinity
    );

    return y;
  }

  private rebalance(node: IntervalNode<T>): IntervalNode<T> {
    const balance = this.getBalance(node);

    // Left heavy
    if (balance > 1) {
      if (this.getBalance(node.left!) < 0) {
        node.left = this.rotateLeft(node.left!);
      }
      return this.rotateRight(node);
    }

    // Right heavy
    if (balance < -1) {
      if (this.getBalance(node.right!) > 0) {
        node.right = this.rotateRight(node.right!);
      }
      return this.rotateLeft(node);
    }

    return node;
  }

  private getMinNode(node: IntervalNode<T>): IntervalNode<T> {
    let current = node;
    while (current.left !== null) {
      current = current.left;
    }
    return current;
  }

  /**
   * Get all values in the tree (in-order traversal)
   */
  getAll(): T[] {
    const results: T[] = [];
    this.inOrder(this.root, results);
    return results;
  }

  private inOrder(node: IntervalNode<T> | null, results: T[]): void {
    if (node === null) {
      return;
    }
    this.inOrder(node.left, results);
    results.push(node.value);
    this.inOrder(node.right, results);
  }
}

export default IntervalTree;
