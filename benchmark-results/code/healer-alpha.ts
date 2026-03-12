/**
 * Interval Tree implementation in TypeScript.
 *
 * Uses a BST augmented with max-end tracking for O(log n) insertion and
 * O(log n + k) search (k = number of results). Deletion is O(log n)
 * via in-order successor replacement with correct size tracking.
 */

export interface Interval<T> {
  start: number;
  end: number;
  value: T;
}

interface TreeNode<T> {
  start: number;
  end: number;
  value: T;
  maxEnd: number; // max end in this subtree
  left: TreeNode<T> | null;
  right: TreeNode<T> | null;
}

export class IntervalTree<T> {
  private root: TreeNode<T> | null = null;
  private _size = 0;

  /** Number of intervals stored. */
  get size(): number {
    return this._size;
  }

  /** Tree is empty. */
  get isEmpty(): boolean {
    return this.root === null;
  }

  /**
   * Insert an interval [start, end] with an associated value.
   * start <= end is required. O(log n).
   */
  insert(start: number, end: number, value: T): void {
    if (start > end) {
      throw new Error(`Invalid interval: start (${start}) > end (${end})`);
    }
    this.root = this.insertNode(this.root, start, end, value);
    this._size++;
  }

  /**
   * Search: return all intervals that overlap a given point.
   * An interval [a, b] overlaps point p iff a <= p <= b.
   * O(log n + k) where k = number of results.
   */
  search(point: number): Interval<T>[] {
    const results: Interval<T>[] = [];
    this.searchNode(this.root, point, results);
    return results;
  }

  /**
   * Delete one interval matching the given value (uses Object.is comparison).
   * Removes the first occurrence found.
   * Returns true if an interval was deleted, false otherwise.
   * O(log n).
   */
  deleteByValue(value: T): boolean {
    let sizeDelta = 0;
    this.root = this.deleteByValueNode(this.root, value, (d) => {
      sizeDelta = d;
    });
    this._size += sizeDelta;
    return sizeDelta < 0;
  }

  /**
   * Return all intervals sorted by start (ascending), then end (ascending).
   */
  getAll(): Interval<T>[] {
    const intervals: Interval<T>[] = [];
    this.collectInOrder(this.root, intervals);
    intervals.sort((a, b) => a.start - b.start || a.end - b.end);
    return intervals;
  }

  /** Remove all intervals. */
  clear(): void {
    this.root = null;
    this._size = 0;
  }

  // ── Private helpers ────────────────────────────────────────────────

  private insertNode(node: TreeNode<T> | null, start: number, end: number, value: T): TreeNode<T> {
    if (node === null) {
      return { start, end, value, maxEnd: end, left: null, right: null };
    }

    if (start < node.start) {
      node.left = this.insertNode(node.left, start, end, value);
    } else {
      node.right = this.insertNode(node.right, start, end, value);
    }

    node.maxEnd = Math.max(node.maxEnd, end);
    return node;
  }

  private searchNode(node: TreeNode<T> | null, point: number, results: Interval<T>[]): void {
    if (node === null) return;

    // Check current node
    if (point >= node.start && point <= node.end) {
      results.push({ start: node.start, end: node.end, value: node.value });
    }

    // Left subtree: check if it might contain overlapping intervals
    if (node.left !== null && node.left.maxEnd >= point) {
      this.searchNode(node.left, point, results);
    }

    // Right subtree: only if point >= node.start (intervals in right have start >= node.start)
    if (point >= node.start && node.right !== null && node.right.maxEnd >= point) {
      this.searchNode(node.right, point, results);
    }
  }

  private deleteByValueNode(
    node: TreeNode<T> | null,
    value: T,
    onResult: (sizeDelta: number) => void,
  ): TreeNode<T> | null {
    if (node === null) return null;

    if (Object.is(node.value, value)) {
      onResult(-1);
      return this.removeNode(node);
    }

    node.left = this.deleteByValueNode(node.left, value, onResult);
    node.right = this.deleteByValueNode(node.right, value, onResult);

    this.updateMaxEnd(node);
    return node;
  }

  private removeNode(node: TreeNode<T>): TreeNode<T> | null {
    // Leaf
    if (node.left === null && node.right === null) return null;
    // One child
    if (node.left === null) return node.right;
    if (node.right === null) return node.left;

    // Two children: replace with in-order successor (min in right subtree),
    // then delete the successor node (no size change — just transplant).
    const successor = this.findMin(node.right);
    node.start = successor.start;
    node.end = successor.end;
    node.value = successor.value;
    // Delete successor from right subtree without double-decrementing size.
    // We pass a no-op callback so size is not affected.
    node.right = this.removeMinNode(node.right);
    this.updateMaxEnd(node);
    return node;
  }

  /** Remove and return the node with the smallest start in the subtree, without changing size. */
  private removeMinNode(node: TreeNode<T>): TreeNode<T> | null {
    if (node.left === null) return node.right;
    node.left = this.removeMinNode(node.left);
    this.updateMaxEnd(node);
    return node;
  }

  private findMin(node: TreeNode<T>): TreeNode<T> {
    while (node.left !== null) node = node.left;
    return node;
  }

  private updateMaxEnd(node: TreeNode<T>): void {
    node.maxEnd = node.end;
    if (node.left !== null) node.maxEnd = Math.max(node.maxEnd, node.left.maxEnd);
    if (node.right !== null) node.maxEnd = Math.max(node.maxEnd, node.right.maxEnd);
  }

  private collectInOrder(node: TreeNode<T> | null, out: Interval<T>[]): void {
    if (node === null) return;
    this.collectInOrder(node.left, out);
    out.push({ start: node.start, end: node.end, value: node.value });
    this.collectInOrder(node.right, out);
  }
}
