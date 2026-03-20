/**
 * IntervalTree - Generic implementation in TypeScript
 * Supports insert, remove, and point search operations
 */

interface Interval<T> {
  start: number;
  end: number;
  data?: T;
}

interface TreeNode<T> {
  interval: Interval<T>;
  maxEnd: number;
  left: TreeNode<T> | null;
  right: TreeNode<T> | null;
}

export class IntervalTree<T = unknown> {
  private root: TreeNode<T> | null = null;
  private size: number = 0;

  /**
   * Insert an interval into the tree
   */
  insert(interval: Interval<T>): void {
    if (interval.start > interval.end) {
      throw new Error("Invalid interval: start must be <= end");
    }

    const newNode: TreeNode<T> = {
      interval: { ...interval },
      maxEnd: interval.end,
      left: null,
      right: null,
    };

    if (!this.root) {
      this.root = newNode;
    } else {
      this.insertNode(this.root, newNode);
    }
    this.size++;
  }

  private insertNode(node: TreeNode<T>, newNode: TreeNode<T>): void {
    // Update maxEnd
    node.maxEnd = Math.max(node.maxEnd, newNode.interval.end);

    const nodeMid = this.getMidpoint(node.interval);
    const newMid = this.getMidpoint(newNode.interval);

    if (newMid < nodeMid) {
      if (!node.left) {
        node.left = newNode;
      } else {
        this.insertNode(node.left, newNode);
      }
    } else {
      if (!node.right) {
        node.right = newNode;
      } else {
        this.insertNode(node.right, newNode);
      }
    }
  }

  /**
   * Remove an interval from the tree
   * Returns true if removed, false if not found
   */
  remove(interval: Interval<T>): boolean {
    const beforeSize = this.size;
    this.root = this.removeNode(this.root, interval);
    return this.size < beforeSize;
  }

  private removeNode(node: TreeNode<T> | null, target: Interval<T>): TreeNode<T> | null {
    if (!node) return null;

    // Check if this is the node to remove
    if (
      node.interval.start === target.start &&
      node.interval.end === target.end
    ) {
      return this.deleteNode(node);
    }

    // Search in appropriate subtree
    const nodeMid = this.getMidpoint(node.interval);
    const targetMid = (target.start + target.end) / 2;

    if (targetMid < nodeMid) {
      node.left = this.removeNode(node.left, target);
    } else {
      node.right = this.removeNode(node.right, target);
    }

    // Update maxEnd after removal
    if (node.left || node.right) {
      node.maxEnd = node.interval.end;
      if (node.left) node.maxEnd = Math.max(node.maxEnd, node.left.maxEnd);
      if (node.right) node.maxEnd = Math.max(node.maxEnd, node.right.maxEnd);
    }

    return node;
  }

  private deleteNode(node: TreeNode<T>): TreeNode<T> | null {
    this.size--;

    if (!node.left && !node.right) {
      return null;
    }

    if (!node.left) {
      return node.right;
    }

    if (!node.right) {
      return node.left;
    }

    // Find inorder successor
    let successor = node.right;
    while (successor.left) {
      successor = successor.left;
    }

    // Replace node data with successor data
    node.interval = { ...successor.interval };
    node.maxEnd = successor.interval.end;

    // Remove successor from right subtree
    node.right = this.removeNode(node.right, successor.interval);

    // Recalculate maxEnd
    node.maxEnd = node.interval.end;
    if (node.left) node.maxEnd = Math.max(node.maxEnd, node.left.maxEnd);
    if (node.right) node.maxEnd = Math.max(node.maxEnd, node.right.maxEnd);

    return node;
  }

  /**
   * Search for all intervals that contain the given point
   */
  search(point: number): Interval<T>[] {
    const results: Interval<T>[] = [];
    this.searchPoint(this.root, point, results);
    return results;
  }

  private searchPoint(node: TreeNode<T> | null, point: number, results: Interval<T>[]): void {
    if (!node) return;

    // If point is before this node's interval, go left
    if (point < node.interval.start) {
      this.searchPoint(node.left, point, results);
      return;
    }

    // If point is after this node's maxEnd, nothing in this subtree can match
    if (point > node.maxEnd) {
      return;
    }

    // Check if current interval contains the point
    if (point >= node.interval.start && point <= node.interval.end) {
      results.push(node.interval);
    }

    // Search both subtrees
    this.searchPoint(node.left, point, results);
    this.searchPoint(node.right, point, results);
  }

  /**
   * Get all intervals in the tree
   */
  getAll(): Interval<T>[] {
    const results: Interval<T>[] = [];
    this.inorderTraversal(this.root, results);
    return results;
  }

  private inorderTraversal(node: TreeNode<T> | null, results: Interval<T>[]): void {
    if (!node) return;
    this.inorderTraversal(node.left, results);
    results.push(node.interval);
    this.inorderTraversal(node.right, results);
  }

  /**
   * Get tree size
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

  private getMidpoint(interval: Interval<T>): number {
    return (interval.start + interval.end) / 2;
  }
}