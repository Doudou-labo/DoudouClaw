/**
 * Interval Tree Implementation
 * 
 * This implementation uses an augmented AVL tree to maintain balance
 * and provides O(log n + k) search performance where k is the number of
 * overlapping intervals found.
 * 
 * Each node stores:
 * - interval: [start, end) numeric range
 * - value: arbitrary data associated with the interval
 * - maxEnd: maximum end value in this subtree (for pruning)
 * - height: for AVL balancing
 * - left/right: child nodes
 */

export interface Interval<T = any> {
  start: number;
  end: number;
  value?: T;
}

class IntervalTreeNode<T> {
  public start: number;
  public end: number;
  public value: T | undefined;
  public maxEnd: number;
  public height: number;
  public left: IntervalTreeNode<T> | null;
  public right: IntervalTreeNode<T> | null;

  constructor(start: number, end: number, value?: T) {
    this.start = start;
    this.end = end;
    this.value = value;
    this.maxEnd = end;
    this.height = 1;
    this.left = null;
    this.right = null;
  }
}

export class IntervalTree<T = any> {
  private root: IntervalTreeNode<T> | null = null;

  /**
   * Insert an interval into the tree
   */
  insert(start: number, end: number, value?: T): void {
    if (start >= end) {
      throw new Error('Invalid interval: start must be less than end');
    }
    this.root = this._insert(this.root, start, end, value);
  }

  /**
   * Delete an interval from the tree
   * 
   * Note: This implementation deletes by interval range and value equality.
   * If multiple identical intervals exist, only one is removed.
   */
  delete(start: number, end: number, value?: T): boolean {
    const [newRoot, deleted] = this._delete(this.root, start, end, value);
    this.root = newRoot;
    return deleted;
  }

  /**
   * Search for all intervals that overlap with a point
   */
  search(point: number): Interval<T>[] {
    const result: Interval<T>[] = [];
    this._searchPoint(this.root, point, result);
    return result;
  }

  /**
   * Search for all intervals that overlap with a range
   */
  searchRange(start: number, end: number): Interval<T>[] {
    const result: Interval<T>[] = [];
    this._searchRange(this.root, start, end, result);
    return result;
  }

  /**
   * Get all intervals in the tree (in-order traversal)
   */
  getAll(): Interval<T>[] {
    const result: Interval<T>[] = [];
    this._inOrder(this.root, result);
    return result;
  }

  /**
   * Clear all intervals from the tree
   */
  clear(): void {
    this.root = null;
  }

  /**
   * Get the number of intervals in the tree
   */
  size(): number {
    return this._size(this.root);
  }

  /**
   * Check if the tree is empty
   */
  isEmpty(): boolean {
    return this.root === null;
  }

  // === Private Helper Methods ===

  private _insert(node: IntervalTreeNode<T> | null, start: number, end: number, value?: T): IntervalTreeNode<T> {
    if (node === null) {
      return new IntervalTreeNode<T>(start, end, value);
    }

    if (start < node.start || (start === node.start && end < node.end)) {
      node.left = this._insert(node.left, start, end, value);
    } else {
      node.right = this._insert(node.right, start, end, value);
    }

    this._updateNode(node);
    return this._balance(node);
  }

  private _delete(
    node: IntervalTreeNode<T> | null,
    start: number,
    end: number,
    value?: T
  ): [IntervalTreeNode<T> | null, boolean] {
    if (node === null) {
      return [null, false];
    }

    let deleted = false;

    if (start === node.start && end === node.end && (value === undefined || value === node.value)) {
      deleted = true;
      
      if (node.left === null && node.right === null) {
        return [null, true];
      } else if (node.left === null) {
        return [node.right, true];
      } else if (node.right === null) {
        return [node.left, true];
      } else {
        const [minNode, newRight] = this._removeMin(node.right);
        minNode.left = node.left;
        minNode.right = newRight;
        this._updateNode(minNode);
        return [this._balance(minNode), true];
      }
    } else if (start < node.start || (start === node.start && end < node.end)) {
      const [newLeft, leftDeleted] = this._delete(node.left, start, end, value);
      node.left = newLeft;
      deleted = leftDeleted;
    } else {
      const [newRight, rightDeleted] = this._delete(node.right, start, end, value);
      node.right = newRight;
      deleted = rightDeleted;
    }

    if (deleted) {
      this._updateNode(node);
      return [this._balance(node), true];
    }

    return [node, false];
  }

  private _removeMin(node: IntervalTreeNode<T>): [IntervalTreeNode<T>, IntervalTreeNode<T> | null] {
    if (node.left === null) {
      return [node, node.right];
    }
    const [minNode, newLeft] = this._removeMin(node.left);
    node.left = newLeft;
    this._updateNode(node);
    return [minNode, this._balance(node)];
  }

  private _searchPoint(node: IntervalTreeNode<T> | null, point: number, result: Interval<T>[]): void {
    if (node === null || point > node.maxEnd) {
      return;
    }

    if (point >= node.start && point < node.end) {
      result.push({ start: node.start, end: node.end, value: node.value });
    }

    if (node.left !== null && point >= node.left.start && point <= node.left.maxEnd) {
      this._searchPoint(node.left, point, result);
    }

    this._searchPoint(node.right, point, result);
  }

  private _searchRange(node: IntervalTreeNode<T> | null, start: number, end: number, result: Interval<T>[]): void {
    if (node === null || start >= node.maxEnd || end <= node.start) {
      return;
    }

    if (!(end <= node.start || start >= node.end)) {
      result.push({ start: node.start, end: node.end, value: node.value });
    }

    this._searchRange(node.left, start, end, result);
    this._searchRange(node.right, start, end, result);
  }

  private _inOrder(node: IntervalTreeNode<T> | null, result: Interval<T>[]): void {
    if (node === null) {
      return;
    }
    this._inOrder(node.left, result);
    result.push({ start: node.start, end: node.end, value: node.value });
    this._inOrder(node.right, result);
  }

  private _size(node: IntervalTreeNode<T> | null): number {
    if (node === null) {
      return 0;
    }
    return 1 + this._size(node.left) + this._size(node.right);
  }

  private _height(node: IntervalTreeNode<T> | null): number {
    return node ? node.height : 0;
  }

  private _updateNode(node: IntervalTreeNode<T>): void {
    const leftHeight = this._height(node.left);
    const rightHeight = this._height(node.right);
    node.height = 1 + Math.max(leftHeight, rightHeight);
    node.maxEnd = Math.max(
      node.end,
      node.left ? node.left.maxEnd : -Infinity,
      node.right ? node.right.maxEnd : -Infinity
    );
  }

  private _balanceFactor(node: IntervalTreeNode<T>): number {
    return this._height(node.left) - this._height(node.right);
  }

  private _balance(node: IntervalTreeNode<T>): IntervalTreeNode<T> {
    const balance = this._balanceFactor(node);

    // Left heavy
    if (balance > 1) {
      if (this._balanceFactor(node.left) < 0) {
        node.left = this._rotateLeft(node.left);
      }
      return this._rotateRight(node);
    }

    // Right heavy
    if (balance < -1) {
      if (this._balanceFactor(node.right) > 0) {
        node.right = this._rotateRight(node.right);
      }
      return this._rotateLeft(node);
    }

    return node;
  }

  private _rotateLeft(node: IntervalTreeNode<T>): IntervalTreeNode<T> {
    const right = node.right!;
    node.right = right.left;
    right.left = node;
    this._updateNode(node);
    this._updateNode(right);
    return right;
  }

  private _rotateRight(node: IntervalTreeNode<T>): IntervalTreeNode<T> {
    const left = node.left!;
    node.left = left.right;
    left.right = node;
    this._updateNode(node);
    this._updateNode(left);
    return left;
  }
}

// === Convenience Methods ===

export function createIntervalTree<T = any>(): IntervalTree<T> {
  return new IntervalTree<T>();
}

// === Utility Functions ===

export function intervalsOverlap(a: Interval, b: Interval): boolean {
  return a.start < b.end && b.start < a.end;
}

export function intervalsOverlapRange(interval: Interval, start: number, end: number): boolean {
  return start < interval.end && interval.start < end;
}

export function pointInInterval(point: number, interval: Interval): boolean {
  return point >= interval.start && point < interval.end;
}

// === Debugging Utility ===

export function printIntervalTree<T>(tree: IntervalTree<T>): void {
  console.log('Interval Tree:');
  console.log(JSON.stringify(tree.getAll(), null, 2));
}
