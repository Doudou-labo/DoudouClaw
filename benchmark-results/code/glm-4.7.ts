/**
 * Generic Interval Tree Implementation
 * Based on balanced binary search tree with augmented max endpoint data
 * Supports intervals [low, high] where low <= high
 */

type Interval<T> = {
  low: T;
  high: T;
};

type IntervalTreeNode<T> = {
  interval: Interval<T>;
  max: T;
  left: IntervalTreeNode<T> | null;
  right: IntervalTreeNode<T> | null;
  parent: IntervalTreeNode<T> | null;
  color: 'red' | 'black';
};

export class IntervalTree<T extends number | bigint> {
  private root: IntervalTreeNode<T> | null = null;
  private compare: (a: T, b: T) => number;
  private size: number = 0;

  constructor(compare?: (a: T, b: T) => number) {
    this.compare = compare || ((a: T, b: T) => {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });
  }

  /**
   * Insert an interval into the tree
   * Time complexity: O(log n)
   */
  insert(low: T, high: T): void {
    if (this.compare(low, high) > 0) {
      throw new Error('Interval low must be <= high');
    }

    const interval = { low, high };
    const newNode: IntervalTreeNode<T> = {
      interval,
      max: high,
      left: null,
      right: null,
      parent: null,
      color: 'red'
    };

    // Standard BST insertion
    let y: IntervalTreeNode<T> | null = null;
    let x: IntervalTreeNode<T> | null = this.root;

    while (x !== null) {
      y = x;
      if (this.compare(newNode.interval.low, x.interval.low) < 0) {
        x = x.left;
      } else {
        x = x.right;
      }
    }

    newNode.parent = y;
    if (y === null) {
      this.root = newNode;
    } else if (this.compare(newNode.interval.low, y.interval.low) < 0) {
      y.left = newNode;
    } else {
      y.right = newNode;
    }

    this.size++;

    // Update max values on path and fix RB tree
    this.updateMaxAfterInsert(newNode);
    this.insertFixup(newNode);
  }

  /**
   * Remove an interval from the tree
   * Time complexity: O(log n)
   */
  remove(low: T, high: T): boolean {
    const node = this.findNode(low, high);
    if (node === null) {
      return false;
    }

    this.deleteNode(node);
    this.size--;
    return true;
  }

  /**
   * Search for all intervals containing a point
   * Time complexity: O(k log n) where k is number of results
   */
  search(point: T): Interval<T>[] {
    const results: Interval<T>[] = [];
    this.searchHelper(this.root, point, results);
    return results;
  }

  /**
   * Search for intervals overlapping a query interval
   * Time complexity: O(k log n) where k is number of results
   */
  searchInterval(queryLow: T, queryHigh: T): Interval<T>[] {
    const results: Interval<T>[] = [];
    this.searchIntervalHelper(this.root, queryLow, queryHigh, results);
    return results;
  }

  /**
   * Get the number of intervals in the tree
   */
  getSize(): number {
    return this.size;
  }

  /**
   * Check if tree is empty
   */
  isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * Clear all intervals
   */
  clear(): void {
    this.root = null;
    this.size = 0;
  }

  /**
   * Get all intervals in sorted order
   */
  getAll(): Interval<T>[] {
    const results: Interval<T>[] = [];
    this.inorderTraversal(this.root, results);
    return results;
  }

  // Private helper methods

  private findNode(low: T, high: T): IntervalTreeNode<T> | null {
    let node: IntervalTreeNode<T> | null = this.root;
    while (node !== null) {
      const cmp = this.compare(low, node.interval.low);
      if (cmp === 0 && this.compare(high, node.interval.high) === 0) {
        return node;
      } else if (cmp < 0) {
        node = node.left;
      } else {
        node = node.right;
      }
    }
    return null;
  }

  private searchHelper(node: IntervalTreeNode<T> | null, point: T, results: Interval<T>[]): void {
    if (node === null) {
      return;
    }

    // Search left subtree if it could contain the point
    if (node.left !== null && this.compare(node.left.max, point) >= 0) {
      this.searchHelper(node.left, point, results);
    }

    // Check if current node's interval contains the point
    if (this.compare(node.interval.low, point) <= 0 &&
        this.compare(point, node.interval.high) <= 0) {
      results.push(node.interval);
    }

    // Search right subtree
    this.searchHelper(node.right, point, results);
  }

  private searchIntervalHelper(
    node: IntervalTreeNode<T> | null,
    queryLow: T,
    queryHigh: T,
    results: Interval<T>[]
  ): void {
    if (node === null) {
      return;
    }

    // Check if current node overlaps with query interval
    if (this.overlaps(node.interval.low, node.interval.high, queryLow, queryHigh)) {
      results.push(node.interval);
    }

    // If left child exists and might have overlapping intervals
    if (node.left !== null && this.compare(node.left.max, queryLow) >= 0) {
      this.searchIntervalHelper(node.left, queryLow, queryHigh, results);
    }

    // Search right subtree if needed
    if (this.compare(node.interval.low, queryHigh) <= 0) {
      this.searchIntervalHelper(node.right, queryLow, queryHigh, results);
    }
  }

  private overlaps(low1: T, high1: T, low2: T, high2: T): boolean {
    return this.compare(low1, high2) <= 0 && this.compare(low2, high1) <= 0;
  }

  private inorderTraversal(node: IntervalTreeNode<T> | null, results: Interval<T>[]): void {
    if (node === null) {
      return;
    }
    this.inorderTraversal(node.left, results);
    results.push(node.interval);
    this.inorderTraversal(node.right, results);
  }

  private updateMaxAfterInsert(node: IntervalTreeNode<T>): void {
    let current: IntervalTreeNode<T> | null = node;
    while (current !== null) {
      current.max = current.interval.high;
      if (current.left !== null && this.compare(current.left.max, current.max) > 0) {
        current.max = current.left.max;
      }
      if (current.right !== null && this.compare(current.right.max, current.max) > 0) {
        current.max = current.right.max;
      }
      current = current.parent;
    }
  }

  private updateMaxAfterDelete(node: IntervalTreeNode<T>): void {
    let current: IntervalTreeNode<T> | null = node;
    while (current !== null) {
      current.max = current.interval.high;
      if (current.left !== null && this.compare(current.left.max, current.max) > 0) {
        current.max = current.left.max;
      }
      if (current.right !== null && this.compare(current.right.max, current.max) > 0) {
        current.max = current.right.max;
      }
      current = current.parent;
    }
  }

  // Red-Black tree operations

  private insertFixup(node: IntervalTreeNode<T>): void {
    while (node.parent !== null && node.parent.color === 'red') {
      if (node.parent.parent === null) {
        break;
      }

      if (node.parent === node.parent.parent.left) {
        const y = node.parent.parent.right;
        if (y !== null && y.color === 'red') {
          node.parent.color = 'black';
          y.color = 'black';
          node.parent.parent.color = 'red';
          node = node.parent.parent;
        } else {
          if (node === node.parent.right) {
            node = node.parent;
            this.leftRotate(node);
          }
          if (node.parent !== null) {
            node.parent.color = 'black';
          }
          if (node.parent !== null && node.parent.parent !== null) {
            node.parent.parent.color = 'red';
            this.rightRotate(node.parent.parent);
          }
        }
      } else {
        const y = node.parent.parent.left;
        if (y !== null && y.color === 'red') {
          node.parent.color = 'black';
          y.color = 'black';
          node.parent.parent.color = 'red';
          node = node.parent.parent;
        } else {
          if (node === node.parent.left) {
            node = node.parent;
            this.rightRotate(node);
          }
          if (node.parent !== null) {
            node.parent.color = 'black';
          }
          if (node.parent !== null && node.parent.parent !== null) {
            node.parent.parent.color = 'red';
            this.leftRotate(node.parent.parent);
          }
        }
      }
    }
    if (this.root !== null) {
      this.root.color = 'black';
    }
  }

  private leftRotate(x: IntervalTreeNode<T>): void {
    if (x.right === null) {
      return;
    }

    const y = x.right;
    x.right = y.left;
    if (y.left !== null) {
      y.left.parent = x;
    }
    y.parent = x.parent;
    if (x.parent === null) {
      this.root = y;
    } else if (x === x.parent.left) {
      x.parent.left = y;
    } else {
      x.parent.right = y;
    }
    y.left = x;
    x.parent = y;

    // Update max values
    this.updateMaxAfterDelete(x);
    this.updateMaxAfterDelete(y);
  }

  private rightRotate(y: IntervalTreeNode<T>): void {
    if (y.left === null) {
      return;
    }

    const x = y.left;
    y.left = x.right;
    if (x.right !== null) {
      x.right.parent = y;
    }
    x.parent = y.parent;
    if (y.parent === null) {
      this.root = x;
    } else if (y === y.parent.right) {
      y.parent.right = x;
    } else {
      y.parent.left = x;
    }
    x.right = y;
    y.parent = x;

    // Update max values
    this.updateMaxAfterDelete(y);
    this.updateMaxAfterDelete(x);
  }

  private deleteNode(z: IntervalTreeNode<T>): void {
    let y: IntervalTreeNode<T> = z;
    let yOriginalColor = y.color;
    let x: IntervalTreeNode<T> | null;

    if (z.left === null) {
      x = z.right;
      this.transplant(z, z.right);
    } else if (z.right === null) {
      x = z.left;
      this.transplant(z, z.left);
    } else {
      y = this.minimum(z.right);
      yOriginalColor = y.color;
      x = y.right;
      if (y.parent === z) {
        if (x !== null) {
          x.parent = y;
        }
      } else {
        this.transplant(y, y.right);
        y.right = z.right;
        if (y.right !== null) {
          y.right.parent = y;
        }
      }
      this.transplant(z, y);
      y.left = z.left;
      if (y.left !== null) {
        y.left.parent = y;
      }
      y.color = z.color;
    }

    // Update max values on path
    if (z.parent !== null) {
      this.updateMaxAfterDelete(z.parent);
    }

    if (yOriginalColor === 'black' && x !== null) {
      this.deleteFixup(x);
    }
  }

  private transplant(u: IntervalTreeNode<T>, v: IntervalTreeNode<T> | null): void {
    if (u.parent === null) {
      this.root = v;
    } else if (u === u.parent.left) {
      u.parent.left = v;
    } else {
      u.parent.right = v;
    }
    if (v !== null) {
      v.parent = u.parent;
    }
  }

  private minimum(node: IntervalTreeNode<T>): IntervalTreeNode<T> {
    while (node.left !== null) {
      node = node.left;
    }
    return node;
  }

  private deleteFixup(x: IntervalTreeNode<T>): void {
    while (x !== this.root && (x.parent === null || x.color === 'black')) {
      if (x.parent === null) {
        break;
      }

      if (x === x.parent.left) {
        let w = x.parent.right;
        if (w === null) {
          break;
        }

        if (w.color === 'red') {
          w.color = 'black';
          x.parent.color = 'red';
          this.leftRotate(x.parent);
          w = x.parent.right;
          if (w === null) {
            break;
          }
        }

        if ((w.left === null || w.left.color === 'black') &&
            (w.right === null || w.right.color === 'black')) {
          w.color = 'red';
          x = x.parent;
        } else {
          if (w.right === null || w.right.color === 'black') {
            if (w.left !== null) {
              w.left.color = 'black';
            }
            w.color = 'red';
            this.rightRotate(w);
            w = x.parent.right;
            if (w === null) {
              break;
            }
          }
          if (w.color !== undefined && x.parent !== null) {
            w.color = x.parent.color;
          }
          if (x.parent !== null) {
            x.parent.color = 'black';
          }
          if (w.right !== null) {
            w.right.color = 'black';
          }
          if (x.parent !== null) {
            this.leftRotate(x.parent);
          }
          x = this.root;
        }
      } else {
        let w = x.parent.left;
        if (w === null) {
          break;
        }

        if (w.color === 'red') {
          w.color = 'black';
          x.parent.color = 'red';
          this.rightRotate(x.parent);
          w = x.parent.left;
          if (w === null) {
            break;
          }
        }

        if ((w.right === null || w.right.color === 'black') &&
            (w.left === null || w.left.color === 'black')) {
          w.color = 'red';
          x = x.parent;
        } else {
          if (w.left === null || w.left.color === 'black') {
            if (w.right !== null) {
              w.right.color = 'black';
            }
            w.color = 'red';
            this.leftRotate(w);
            w = x.parent.left;
            if (w === null) {
              break;
            }
          }
          if (w.color !== undefined && x.parent !== null) {
            w.color = x.parent.color;
          }
          if (x.parent !== null) {
            x.parent.color = 'black';
          }
          if (w.left !== null) {
            w.left.color = 'black';
          }
          if (x.parent !== null) {
            this.rightRotate(x.parent);
          }
          x = this.root;
        }
      }
    }
    x.color = 'black';
  }
}