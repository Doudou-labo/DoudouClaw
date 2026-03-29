/**
 * Generic Interval Tree implementation using an augmented AVL tree.
 * Supports O(log n) insert, remove, and point queries on average.
 */

export interface Interval {
  low: number;
  high: number;
}

export interface IntervalEntry<T = unknown> extends Interval {
  data: T;
}

interface Node<T = unknown> {
  interval: IntervalEntry<T>;
  maxHigh: number;       // max of all high values in this subtree
  height: number;
  left: Node<T> | null;
  right: Node<T> | null;
}

export class IntervalTree<T = unknown> {
  private root: Node<T> | null = null;
  private _size = 0;

  // ── Public API ──────────────────────────────────────────────────

  /** Number of intervals currently stored. */
  get size(): number {
    return this._size;
  }

  /** Insert an interval with optional associated data. */
  insert(low: number, high: number, data?: T): void {
    if (low > high) {
      throw new RangeError(`Invalid interval: low (${low}) > high (${high})`);
    }
    const entry: IntervalEntry<T> = { low, high, data: data as T };
    this.root = this._insert(this.root, entry);
    this._size++;
  }

  /**
   * Remove the first interval that exactly matches [low, high].
   * If data is provided, also matches the data value.
   * Returns true if an interval was removed.
   */
  remove(low: number, high: number, data?: T): boolean {
    if (!this._findExact(this.root, low, high, data)) return false;
    this.root = this._remove(this.root, low, high, data);
    this._size--;
    return true;
  }

  /**
   * Search all intervals that contain the given point.
   * Returns an array of IntervalEntry objects.
   */
  search(point: number): IntervalEntry<T>[] {
    const results: IntervalEntry<T>[] = [];
    this._search(this.root, point, results);
    return results;
  }

  /** In-order traversal (for debugging). */
  toArray(): IntervalEntry<T>[] {
    const result: IntervalEntry<T>[] = [];
    this._inorder(this.root, result);
    return result;
  }

  // ── Internal: AVL + Augmentation ────────────────────────────────

  private _height(node: Node<T> | null): number {
    return node ? node.height : 0;
  }

  private _update(node: Node<T>): void {
    node.height = 1 + Math.max(this._height(node.left), this._height(node.right));
    node.maxHigh = node.interval.high;
    if (node.left) node.maxHigh = Math.max(node.maxHigh, node.left.maxHigh);
    if (node.right) node.maxHigh = Math.max(node.maxHigh, node.right.maxHigh);
  }

  private _balanceFactor(node: Node<T>): number {
    return this._height(node.left) - this._height(node.right);
  }

  private _rotateLeft(a: Node<T>): Node<T> {
    const b = a.right!;
    a.right = b.left;
    b.left = a;
    this._update(a);
    this._update(b);
    return b;
  }

  private _rotateRight(b: Node<T>): Node<T> {
    const a = b.left!;
    b.left = a.right;
    a.right = b;
    this._update(b);
    this._update(a);
    return a;
  }

  private _balance(node: Node<T>): Node<T> {
    this._update(node);
    const bf = this._balanceFactor(node);

    if (bf > 1) {
      if (this._balanceFactor(node.left!) < 0) {
        node.left = this._rotateLeft(node.left!);
      }
      return this._rotateRight(node);
    }
    if (bf < -1) {
      if (this._balanceFactor(node.right!) > 0) {
        node.right = this._rotateRight(node.right!);
      }
      return this._rotateLeft(node);
    }
    return node;
  }

  private _insert(node: Node<T> | null, interval: IntervalEntry<T>): Node<T> {
    if (!node) {
      return { interval, maxHigh: interval.high, height: 1, left: null, right: null };
    }

    // Sort by low, then by high to break ties.
    if (interval.low < node.interval.low ||
        (interval.low === node.interval.low && interval.high < node.interval.high)) {
      node.left = this._insert(node.left, interval);
    } else {
      node.right = this._insert(node.right, interval);
    }

    return this._balance(node);
  }

  private _findExact(node: Node<T> | null, low: number, high: number, data?: T): boolean {
    if (!node) return false;
    if (node.interval.low === low && node.interval.high === high &&
        (data === undefined || node.interval.data === data)) {
      return true;
    }
    if (low < node.interval.low ||
        (low === node.interval.low && high < node.interval.high)) {
      return this._findExact(node.left, low, high, data);
    }
    return this._findExact(node.right, low, high, data);
  }

  private _findMin(node: Node<T>): Node<T> {
    while (node.left) node = node.left;
    return node;
  }

  private _remove(node: Node<T> | null, low: number, high: number, data?: T): Node<T> | null {
    if (!node) return null;

    if (low < node.interval.low ||
        (low === node.interval.low && high < node.interval.high)) {
      node.left = this._remove(node.left, low, high, data);
      return this._balance(node);
    }
    if (low > node.interval.low ||
        (low === node.interval.low && high > node.interval.high)) {
      node.right = this._remove(node.right, low, high, data);
      return this._balance(node);
    }

    // Found a node matching low/high — check data match
    const dataMatches = data === undefined || node.interval.data === data;

    if (!dataMatches) {
      // Duplicate low/high with different data: try left subtree
      node.left = this._remove(node.left, low, high, data);
      const balanced = this._balance(node);
      if (balanced.interval.low === low && balanced.interval.high === high &&
          (data === undefined || balanced.interval.data === data)) {
        return balanced;
      }
      // Try right if left removal didn't match
      node.right = this._remove(node.right, low, high, data);
      return this._balance(node);
    }

    // Match — delete this node
    if (!node.left || !node.right) {
      return node.left ?? node.right;
    }

    const successor = this._findMin(node.right);
    node.interval = successor.interval;
    node.right = this._remove(node.right, successor.interval.low, successor.interval.high, successor.interval.data);
    return this._balance(node);
  }

  private _search(node: Node<T> | null, point: number, results: IntervalEntry<T>[]): void {
    if (!node) return;

    // Prune: if point > maxHigh of this subtree, nothing can contain it
    if (point > node.maxHigh) return;

    // Go left if the left subtree's maxHigh could contain point
    if (node.left && point <= node.left.maxHigh) {
      this._search(node.left, point, results);
    }

    // Check current node
    if (point >= node.interval.low && point <= node.interval.high) {
      results.push(node.interval);
    }

    // Go right if point >= current node's low
    // (intervals on the right have low >= node.low, so they might still contain point)
    if (node.right && point >= node.interval.low) {
      this._search(node.right, point, results);
    }
  }

  private _inorder(node: Node<T> | null, result: IntervalEntry<T>[]): void {
    if (!node) return;
    this._inorder(node.left, result);
    result.push(node.interval);
    this._inorder(node.right, result);
  }
}
