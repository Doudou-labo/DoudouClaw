/**
 * Interval Tree implementation using a Red-Black BST.
 * Supports insertion, deletion, search by point, and ordered retrieval.
 * All operations O(log n) expected.
 */

interface Interval {
  start: number;
  end: number;
}

interface Node<T> {
  interval: Interval;
  value: T;
  max: number; // max endpoint in subtree
  color: 'red' | 'black';
  left: Node<T> | null;
  right: Node<T> | null;
  size: number;
}

export class IntervalTree<T> {
  private root: Node<T> | null = null;

  // ── Public API ──

  insert(start: number, end: number, value: T): void {
    if (start > end) throw new Error(`Invalid interval: [${start}, ${end}]`);
    this.root = this._insert(this.root, { start, end }, value);
    this.root.color = 'black';
  }

  /**
   * Returns all (interval, value) pairs that overlap the given point.
   * Two intervals [a,b] and [c,d] overlap iff a <= d && c <= b.
   */
  search(point: number): Array<{ interval: Interval; value: T }> {
    const results: Array<{ interval: Interval; value: T }> = [];
    this._search(this.root, point, results);
    return results;
  }

  /**
   * Remove the first interval whose .value is deeply equal to `value`.
   * Returns true if a node was removed.
   */
  remove(value: T): boolean {
    if (!this.root) return false;
    const key = this._findKeyByValue(this.root, value);
    if (key === null) return false;
    this.root = this._delete(this.root, key);
    if (this.root) this.root.color = 'black';
    return true;
  }

  /**
   * Returns all intervals sorted by start (then end).
   */
  getAll(): Array<{ interval: Interval; value: T }> {
    const results: Array<{ interval: Interval; value: T }> = [];
    this._inorder(this.root, results);
    return results;
  }

  get size(): number {
    return this._size(this.root);
  }

  // ── Internal helpers ──

  private _size(n: Node<T> | null): number {
    return n ? n.size : 0;
  }

  private _max(n: Node<T> | null): number {
    return n ? n.max : -Infinity;
  }

  private _isRed(n: Node<T> | null): boolean {
    return n !== null && n.color === 'red';
  }

  private _update(n: Node<T>): void {
    n.size = 1 + this._size(n.left) + this._size(n.right);
    n.max = Math.max(n.interval.end, this._max(n.left), this._max(n.right));
  }

  private _rotateLeft(h: Node<T>): Node<T> {
    const x = h.right!;
    h.right = x.left;
    x.left = h;
    x.color = h.color;
    h.color = 'red';
    this._update(h);
    this._update(x);
    return x;
  }

  private _rotateRight(h: Node<T>): Node<T> {
    const x = h.left!;
    h.left = x.right;
    x.right = h;
    x.color = h.color;
    h.color = 'red';
    this._update(h);
    this._update(x);
    return x;
  }

  private _flipColors(h: Node<T>): void {
    h.color = h.color === 'red' ? 'black' : 'red';
    h.left!.color = h.left!.color === 'red' ? 'black' : 'red';
    h.right!.color = h.right!.color === 'red' ? 'black' : 'red';
  }

  private _balance(h: Node<T>): Node<T> {
    if (this._isRed(h.right) && !this._isRed(h.left)) h = this._rotateLeft(h);
    if (this._isRed(h.left) && this._isRed(h.left!.left)) h = this._rotateRight(h);
    if (this._isRed(h.left) && this._isRed(h.right)) this._flipColors(h);
    this._update(h);
    return h;
  }

  private _insert(h: Node<T> | null, interval: Interval, value: T): Node<T> {
    if (!h) {
      return { interval, value, max: interval.end, color: 'red', left: null, right: null, size: 1 };
    }
    const cmp = this._compare(interval, h.interval);
    if (cmp < 0) h.left = this._insert(h.left, interval, value);
    else h.right = this._insert(h.right, interval, value);
    return this._balance(h);
  }

  /**
   * Compare two intervals by start, then end.
   */
  private _compare(a: Interval, b: Interval): number {
    if (a.start !== b.start) return a.start - b.start;
    if (a.end !== b.end) return a.end - b.end;
    return 0;
  }

  /**
   * Find the key (interval) in the tree whose value deeply equals `value`.
   * Returns the first match found (in-order traversal).
   */
  private _findKeyByValue(n: Node<T> | null, value: T): Interval | null {
    if (!n) return null;
    // Check left subtree first (in-order)
    const left = this._findKeyByValue(n.left, value);
    if (left) return left;
    // Check this node
    if (this._deepEqual(n.value, value)) return n.interval;
    // Check right subtree
    return this._findKeyByValue(n.right, value);
  }

  private _deepEqual(a: T, b: T): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  private _delete(h: Node<T>, interval: Interval): Node<T> | null {
    const cmp = this._compare(interval, h.interval);
    if (cmp < 0) {
      if (!h.left) return h;
      if (!this._isRed(h.left) && !this._isRed(h.left!.left)) h = this._moveRedLeft(h);
      h.left = this._delete(h.left!, interval);
    } else {
      if (this._isRed(h.left)) h = this._rotateRight(h);
      const cmp2 = this._compare(interval, h.interval);
      if (cmp2 === 0 && !h.right) return null;
      if (!h.right) return h;
      if (!this._isRed(h.right) && !this._isRed(h.right.left)) h = this._moveRedRight(h);
      if (this._compare(interval, h.interval) === 0) {
        const min = this._min(h.right!);
        h.interval = min.interval;
        h.value = min.value;
        h.right = this._deleteMin(h.right!);
      } else {
        h.right = this._delete(h.right!, interval);
      }
    }
    return this._balance(h);
  }

  private _min(h: Node<T>): Node<T> {
    return h.left ? this._min(h.left) : h;
  }

  private _deleteMin(h: Node<T>): Node<T> | null {
    if (!h.left) return null;
    if (!this._isRed(h.left) && !this._isRed(h.left!.left)) h = this._moveRedLeft(h);
    h.left = this._deleteMin(h.left!);
    return this._balance(h);
  }

  private _moveRedLeft(h: Node<T>): Node<T> {
    this._flipColors(h);
    if (h.right && this._isRed(h.right.left)) {
      h.right = this._rotateRight(h.right);
      h = this._rotateLeft(h);
      this._flipColors(h);
    }
    return h;
  }

  private _moveRedRight(h: Node<T>): Node<T> {
    this._flipColors(h);
    if (h.left && this._isRed(h.left.left)) {
      h = this._rotateRight(h);
      this._flipColors(h);
    }
    return h;
  }

  private _search(n: Node<T> | null, point: number, results: Array<{ interval: Interval; value: T }>): void {
    if (!n) return;
    // Check if current node overlaps point
    if (n.interval.start <= point && point <= n.interval.end) {
      results.push({ interval: n.interval, value: n.value });
    }
    // If left subtree's max endpoint >= point, there may be overlaps on the left
    if (n.left && this._max(n.left) >= point) {
      this._search(n.left, point, results);
    }
    // If point > current start, right subtree might have overlaps
    if (point > n.interval.start) {
      this._search(n.right, point, results);
    }
  }

  private _inorder(n: Node<T> | null, results: Array<{ interval: Interval; value: T }>): void {
    if (!n) return;
    this._inorder(n.left, results);
    results.push({ interval: n.interval, value: n.value });
    this._inorder(n.right, results);
  }
}
