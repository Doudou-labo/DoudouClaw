/**
 * Interval Tree Implementation
 * 
 * Architecture: Augmented AVL Tree (self-balancing BST)
 * - Each node stores an interval [start, end) and an associated value
 * - Augmented with maxEnd: maximum end value in the subtree
 * - This enables O(log n + k) point query search with subtree pruning
 * 
 * Balancing: AVL rotations (guarantees O(log n) height)
 * Complexity:
 * - Insert: O(log n)
 * - Delete: O(log n)
 * - Point search: O(log n + k) where k = number of matching intervals
 * - Get all: O(n)
 */

export interface Interval<T = unknown> {
  start: number;
  end: number;
  value: T;
}

interface TreeNode<T> {
  start: number;
  end: number;
  value: T;
  maxEnd: number;
  height: number;
  left: TreeNode<T> | null;
  right: TreeNode<T> | null;
}

export class IntervalTree<T = unknown> {
  private root: TreeNode<T> | null = null;
  private _size: number = 0;

  /**
   * Insert an interval with an associated value
   * Time: O(log n)
   */
  insert(start: number, end: number, value: T): void {
    if (start >= end) {
      throw new Error(`Invalid interval: [${start}, ${end}). Start must be < end.`);
    }
    this.root = this._insert(this.root, start, end, value);
    this._size++;
  }

  private _insert(node: TreeNode<T> | null, start: number, end: number, value: T): TreeNode<T> {
    if (node === null) {
      return {
        start,
        end,
        value,
        maxEnd: end,
        height: 1,
        left: null,
        right: null,
      };
    }

    // Standard BST insertion
    if (start < node.start || (start === node.start && end < node.end)) {
      node.left = this._insert(node.left, start, end, value);
    } else {
      node.right = this._insert(node.right, start, end, value);
    }

    // Update height and maxEnd
    node.height = 1 + Math.max(this._getHeight(node.left), this._getHeight(node.right));
    node.maxEnd = Math.max(node.end, this._getMaxEnd(node.left), this._getMaxEnd(node.right));

    // Balance the tree (AVL)
    const balance = this._getBalance(node);

    // Left Left Case
    if (balance > 1 && (start < node.left!.start || (start === node.left!.start && end < node.left!.end))) {
      return this._rotateRight(node);
    }

    // Right Right Case
    if (balance < -1 && (start > node.right!.start || (start === node.right!.start && end > node.right!.end))) {
      return this._rotateLeft(node);
    }

    // Left Right Case
    if (balance > 1 && (start > node.left!.start || (start === node.left!.start && end > node.left!.end))) {
      node.left = this._rotateLeft(node.left!);
      return this._rotateRight(node);
    }

    // Right Left Case
    if (balance < -1 && (start < node.right!.start || (start === node.right!.start && end < node.right!.end))) {
      node.right = this._rotateRight(node.right!);
      return this._rotateLeft(node);
    }

    return node;
  }

  /**
   * Delete an interval. Removes the first matching interval found.
   * Time: O(log n)
   */
  delete(start: number, end: number, value?: T): boolean {
    const initialSize = this._size;
    this.root = this._delete(this.root, start, end, value);
    return this._size < initialSize;
  }

  private _delete(node: TreeNode<T> | null, start: number, end: number, value?: T): TreeNode<T> | null {
    if (node === null) {
      return null;
    }

    // Search for the node to delete
    if (start < node.start || (start === node.start && end < node.end)) {
      node.left = this._delete(node.left, start, end, value);
    } else if (start > node.start || (start === node.start && end > node.end)) {
      node.right = this._delete(node.right, start, end, value);
    } else {
      // Found matching start/end, check value if provided
      if (value !== undefined && value !== node.value) {
        // Value doesn't match, continue searching in right subtree (duplicate keys go right)
        node.right = this._delete(node.right, start, end, value);
        // Still need to update this node
      } else {
        // Found the node to delete
        this._size--;

        // Node with only one child or no child
        if (node.left === null) {
          return node.right;
        } else if (node.right === null) {
          return node.left;
        }

        // Node with two children: get inorder successor (smallest in right subtree)
        const successor = this._getMin(node.right);
        node.start = successor.start;
        node.end = successor.end;
        node.value = successor.value;
        node.right = this._delete(node.right, successor.start, successor.end, successor.value);
      }
    }

    // Update height and maxEnd
    node.height = 1 + Math.max(this._getHeight(node.left), this._getHeight(node.right));
    node.maxEnd = Math.max(node.end, this._getMaxEnd(node.left), this._getMaxEnd(node.right));

    // Balance the tree
    const balance = this._getBalance(node);

    // Left Left Case
    if (balance > 1 && this._getBalance(node.left!) >= 0) {
      return this._rotateRight(node);
    }

    // Left Right Case
    if (balance > 1 && this._getBalance(node.left!) < 0) {
      node.left = this._rotateLeft(node.left!);
      return this._rotateRight(node);
    }

    // Right Right Case
    if (balance < -1 && this._getBalance(node.right!) <= 0) {
      return this._rotateLeft(node);
    }

    // Right Left Case
    if (balance < -1 && this._getBalance(node.right!) > 0) {
      node.right = this._rotateRight(node.right!);
      return this._rotateLeft(node);
    }

    return node;
  }

  private _getMin(node: TreeNode<T>): TreeNode<T> {
    while (node.left !== null) {
      node = node.left;
    }
    return node;
  }

  /**
   * Search for all intervals containing a point
   * Uses maxEnd augmentation to prune subtrees
   * Time: O(log n + k) where k = number of results
   */
  search(point: number): Interval<T>[] {
    const results: Interval<T>[] = [];
    this._search(this.root, point, results);
    return results;
  }

  private _search(node: TreeNode<T> | null, point: number, results: Interval<T>[]): void {
    if (node === null) return;

    // Pruning: if point > maxEnd in this subtree, no intervals can contain it
    if (point >= node.maxEnd) return;

    // Search left subtree first (intervals with smaller start)
    if (node.left !== null && point < node.left.maxEnd) {
      this._search(node.left, point, results);
    }

    // Check current node
    if (node.start <= point && point < node.end) {
      results.push({ start: node.start, end: node.end, value: node.value });
    }

    // Search right subtree if point could be in it
    // Optimization: only go right if point >= node.start (since right subtree has start >= node.start)
    if (node.right !== null && point >= node.start && point < node.right.maxEnd) {
      this._search(node.right, point, results);
    }
  }

  /**
   * Get all intervals in the tree (in-order traversal)
   * Time: O(n)
   */
  getAll(): Interval<T>[] {
    const results: Interval<T>[] = [];
    this._inorder(this.root, results);
    return results;
  }

  private _inorder(node: TreeNode<T> | null, results: Interval<T>[]): void {
    if (node === null) return;
    this._inorder(node.left, results);
    results.push({ start: node.start, end: node.end, value: node.value });
    this._inorder(node.right, results);
  }

  /**
   * Clear all intervals from the tree
   * Time: O(1)
   */
  clear(): void {
    this.root = null;
    this._size = 0;
  }

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

  // AVL Tree helper methods
  private _getHeight(node: TreeNode<T> | null): number {
    return node?.height ?? 0;
  }

  private _getMaxEnd(node: TreeNode<T> | null): number {
    return node?.maxEnd ?? Number.NEGATIVE_INFINITY;
  }

  private _getBalance(node: TreeNode<T>): number {
    return this._getHeight(node.left) - this._getHeight(node.right);
  }

  private _rotateRight(y: TreeNode<T>): TreeNode<T> {
    const x = y.left!;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    y.height = 1 + Math.max(this._getHeight(y.left), this._getHeight(y.right));
    x.height = 1 + Math.max(this._getHeight(x.left), this._getHeight(x.right));

    y.maxEnd = Math.max(y.end, this._getMaxEnd(y.left), this._getMaxEnd(y.right));
    x.maxEnd = Math.max(x.end, this._getMaxEnd(x.left), this._getMaxEnd(x.right));

    return x;
  }

  private _rotateLeft(x: TreeNode<T>): TreeNode<T> {
    const y = x.right!;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    x.height = 1 + Math.max(this._getHeight(x.left), this._getHeight(x.right));
    y.height = 1 + Math.max(this._getHeight(y.left), this._getHeight(y.right));

    x.maxEnd = Math.max(x.end, this._getMaxEnd(x.left), this._getMaxEnd(x.right));
    y.maxEnd = Math.max(y.end, this._getMaxEnd(y.left), this._getMaxEnd(y.right));

    return y;
  }

  /**
   * Validate the tree structure (for debugging/testing)
   * Checks AVL balance and maxEnd correctness
   */
  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    this._validate(this.root, errors);
    return { valid: errors.length === 0, errors };
  }

  private _validate(node: TreeNode<T> | null, errors: string[], path: string = 'root'): void {
    if (node === null) return;

    // Check AVL balance
    const balance = this._getBalance(node);
    if (Math.abs(balance) > 1) {
      errors.push(`Node ${path} is unbalanced (balance=${balance})`);
    }

    // Check maxEnd correctness
    const expectedMaxEnd = Math.max(
      node.end,
      this._getMaxEnd(node.left),
      this._getMaxEnd(node.right)
    );
    if (node.maxEnd !== expectedMaxEnd) {
      errors.push(`Node ${path} has incorrect maxEnd: ${node.maxEnd} !== ${expectedMaxEnd}`);
    }

    // Check BST property
    if (node.left !== null && node.left.start > node.start) {
      errors.push(`Node ${path} violates BST property with left child`);
    }
    if (node.right !== null && node.right.start < node.start) {
      errors.push(`Node ${path} violates BST property with right child`);
    }

    this._validate(node.left, errors, `${path}.left`);
    this._validate(node.right, errors, `${path}.right`);
  }
}

export default IntervalTree;
