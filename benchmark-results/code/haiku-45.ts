/**
 * Interval data type
 */
export interface Interval<T> {
  start: number;
  end: number;
  value: T;
}

/**
 * Node color for Red-Black Tree
 */
enum Color {
  RED = 'RED',
  BLACK = 'BLACK',
}

/**
 * Red-Black Tree Node with interval augmentation
 */
class RBNode<T> {
  color: Color = Color.RED;
  left: RBNode<T> | null = null;
  right: RBNode<T> | null = null;
  parent: RBNode<T> | null = null;
  
  // Augmentation: max end value in subtree
  maxEnd: number;

  constructor(
    public start: number,
    public end: number,
    public value: T
  ) {
    this.maxEnd = end;
  }
}

/**
 * Augmented Red-Black Tree implementation for Interval Search Trees
 * 
 * Time Complexity:
 * - insert: O(log n)
 * - delete: O(log n)
 * - search: O(log n + k) where k is number of results
 * 
 * Each node tracks maxEnd in its subtree for efficient overlap detection
 */
export class IntervalTree<T> {
  private root: RBNode<T> | null = null;
  private size: number = 0;

  /**
   * Insert an interval into the tree
   * @param start - interval start (inclusive)
   * @param end - interval end (inclusive)
   * @param value - the value to associate with this interval
   */
  insert(start: number, end: number, value: T): void {
    if (start > end) {
      throw new Error('Invalid interval: start must be <= end');
    }

    if (this.root === null) {
      this.root = new RBNode(start, end, value);
      this.root.color = Color.BLACK;
      this.size = 1;
      return;
    }

    // Standard BST insertion by start point
    let current = this.root;
    let parent: RBNode<T> | null = null;

    while (current !== null) {
      parent = current;
      // Update maxEnd along the path
      if (end > current.maxEnd) {
        current.maxEnd = end;
      }

      if (start < current.start) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    // Create new node
    const newNode = new RBNode(start, end, value);
    newNode.parent = parent;

    if (parent === null) {
      this.root = newNode;
    } else if (start < parent.start) {
      parent.left = newNode;
    } else {
      parent.right = newNode;
    }

    this.size++;

    // Fix RB tree properties
    this.insertFixup(newNode);
  }

  /**
   * Delete an interval from the tree
   * @param start - interval start
   * @param end - interval end
   * @param value - optional value to match (if not provided, deletes first match by start/end)
   * @returns true if deleted, false if not found
   */
  delete(start: number, end: number, value?: T): boolean {
    const node = this.findNode(start, end, value);
    if (node === null) return false;

    this.deleteNode(node);
    return true;
  }

  /**
   * Search for all intervals containing a given point
   * @param point - the point to search for
   * @returns array of all intervals containing the point
   */
  search(point: number): Interval<T>[] {
    const result: Interval<T>[] = [];
    this.searchHelper(this.root, point, result);
    return result;
  }

  /**
   * Get all intervals in the tree
   */
  getAll(): Interval<T>[] {
    const result: Interval<T>[] = [];
    this.inorderTraversal(this.root, result);
    return result;
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
   * Clear the tree
   */
  clear(): void {
    this.root = null;
    this.size = 0;
  }

  /**
   * Verify tree invariants (for testing)
   */
  verify(): boolean {
    if (this.root === null) return this.size === 0;
    
    // Check all maxEnd values are correct
    return this.verifyMaxEnd(this.root) && this.verifyRBProperties(this.root).valid;
  }

  // ==================== Private Helper Methods ====================

  private findNode(start: number, end: number, value?: T): RBNode<T> | null {
    let current = this.root;

    while (current !== null) {
      if (current.start === start && current.end === end) {
        if (value === undefined || current.value === value) {
          return current;
        }
      }

      if (start < current.start) {
        current = current.left;
      } else if (start > current.start) {
        current = current.right;
      } else {
        // Same start, try both branches
        const leftResult = this.findInSubtree(current.left, start, end, value);
        if (leftResult !== null) return leftResult;

        const rightResult = this.findInSubtree(current.right, start, end, value);
        if (rightResult !== null) return rightResult;

        return null;
      }
    }

    return null;
  }

  private findInSubtree(node: RBNode<T> | null, start: number, end: number, value?: T): RBNode<T> | null {
    while (node !== null) {
      if (node.start === start && node.end === end) {
        if (value === undefined || node.value === value) {
          return node;
        }
      }

      if (start < node.start) {
        node = node.left;
      } else if (start > node.start) {
        node = node.right;
      } else {
        const leftResult = this.findInSubtree(node.left, start, end, value);
        if (leftResult !== null) return leftResult;
        node = node.right;
      }
    }
    return null;
  }

  private deleteNode(node: RBNode<T>): void {
    let nodeToFix: RBNode<T> | null = null;
    let nodeToFixParent: RBNode<T> | null = null;

    // Case 1: node has two children
    if (node.left !== null && node.right !== null) {
      // Find inorder successor
      let successor = node.right;
      while (successor.left !== null) {
        successor = successor.left;
      }

      // Copy successor's data to node
      node.start = successor.start;
      node.end = successor.end;
      node.value = successor.value;

      // Delete successor instead
      node = successor;
    }

    // Case 2: node has 0 or 1 child
    const child = node.left !== null ? node.left : node.right;

    if (child !== null) {
      child.parent = node.parent;
    }

    if (node.parent === null) {
      this.root = child;
    } else if (node === node.parent.left) {
      node.parent.left = child;
    } else {
      node.parent.right = child;
    }

    // Update maxEnd up the tree
    if (node.parent !== null) {
      this.updateMaxEnd(node.parent);
    }

    // Fix RB properties if deleted node was black
    if (node.color === Color.BLACK) {
      nodeToFix = child;
      nodeToFixParent = node.parent;
      this.deleteFixup(nodeToFix, nodeToFixParent);
    }

    this.size--;
  }

  private updateMaxEnd(node: RBNode<T> | null): void {
    while (node !== null) {
      const oldMax = node.maxEnd;
      node.maxEnd = node.end;

      if (node.left !== null) {
        node.maxEnd = Math.max(node.maxEnd, node.left.maxEnd);
      }
      if (node.right !== null) {
        node.maxEnd = Math.max(node.maxEnd, node.right.maxEnd);
      }

      if (node.maxEnd === oldMax) break; // No change, stop propagating
      node = node.parent;
    }
  }

  private searchHelper(node: RBNode<T> | null, point: number, result: Interval<T>[]): void {
    if (node === null) return;

    // If point is less than node's start, go left
    if (point < node.start) {
      this.searchHelper(node.left, point, result);
      return;
    }

    // If point is in this interval, add it
    if (point >= node.start && point <= node.end) {
      result.push({
        start: node.start,
        end: node.end,
        value: node.value,
      });
    }

    // If left subtree's maxEnd >= point, it might contain overlapping intervals
    if (node.left !== null && node.left.maxEnd >= point) {
      this.searchHelper(node.left, point, result);
    }

    // Always check right subtree (point >= node.start, so right side might have it)
    this.searchHelper(node.right, point, result);
  }

  private inorderTraversal(node: RBNode<T> | null, result: Interval<T>[]): void {
    if (node === null) return;

    this.inorderTraversal(node.left, result);
    result.push({
      start: node.start,
      end: node.end,
      value: node.value,
    });
    this.inorderTraversal(node.right, result);
  }

  private insertFixup(node: RBNode<T>): void {
    while (node.parent !== null && node.parent.color === Color.RED) {
      if (node.parent === node.parent.parent?.left) {
        const uncle = node.parent.parent?.right;

        if (uncle !== null && uncle.color === Color.RED) {
          // Case 1: uncle is red
          node.parent.color = Color.BLACK;
          uncle.color = Color.BLACK;
          node.parent.parent!.color = Color.RED;
          node = node.parent.parent!;
        } else {
          // Case 2/3: uncle is black
          if (node === node.parent.right) {
            // Case 2: node is right child
            node = node.parent;
            this.rotateLeft(node);
          }
          // Case 3: node is left child
          node.parent!.color = Color.BLACK;
          node.parent!.parent!.color = Color.RED;
          this.rotateRight(node.parent!.parent!);
        }
      } else {
        const uncle = node.parent.parent?.left;

        if (uncle !== null && uncle.color === Color.RED) {
          node.parent.color = Color.BLACK;
          uncle.color = Color.BLACK;
          node.parent.parent!.color = Color.RED;
          node = node.parent.parent!;
        } else {
          if (node === node.parent.left) {
            node = node.parent;
            this.rotateRight(node);
          }
          node.parent!.color = Color.BLACK;
          node.parent!.parent!.color = Color.RED;
          this.rotateLeft(node.parent!.parent!);
        }
      }
    }
    this.root!.color = Color.BLACK;
  }

  private deleteFixup(node: RBNode<T> | null, parent: RBNode<T> | null): void {
    while (node !== this.root && this.getColor(node) === Color.BLACK) {
      if (node === parent?.left) {
        let sibling = parent.right;

        if (this.getColor(sibling) === Color.RED) {
          sibling!.color = Color.BLACK;
          parent.color = Color.RED;
          this.rotateLeft(parent);
          sibling = parent.right;
        }

        if (
          this.getColor(sibling?.left) === Color.BLACK &&
          this.getColor(sibling?.right) === Color.BLACK
        ) {
          sibling!.color = Color.RED;
          node = parent;
          parent = node.parent;
        } else {
          if (this.getColor(sibling?.right) === Color.BLACK) {
            if (sibling?.left) sibling.left.color = Color.BLACK;
            sibling!.color = Color.RED;
            this.rotateRight(sibling!);
            sibling = parent.right;
          }
          sibling!.color = parent.color;
          parent.color = Color.BLACK;
          if (sibling?.right) sibling.right.color = Color.BLACK;
          this.rotateLeft(parent);
          node = this.root;
          break;
        }
      } else {
        let sibling = parent?.left;

        if (this.getColor(sibling) === Color.RED) {
          sibling!.color = Color.BLACK;
          parent!.color = Color.RED;
          this.rotateRight(parent!);
          sibling = parent!.left;
        }

        if (
          this.getColor(sibling?.left) === Color.BLACK &&
          this.getColor(sibling?.right) === Color.BLACK
        ) {
          sibling!.color = Color.RED;
          node = parent;
          parent = node?.parent || null;
        } else {
          if (this.getColor(sibling?.left) === Color.BLACK) {
            if (sibling?.right) sibling.right.color = Color.BLACK;
            sibling!.color = Color.RED;
            this.rotateLeft(sibling!);
            sibling = parent?.right || null;
          }
          if (sibling && parent) {
            sibling.color = parent.color;
            parent.color = Color.BLACK;
            if (sibling.left) sibling.left.color = Color.BLACK;
            this.rotateRight(parent);
            node = this.root;
            break;
          }
        }
      }
    }

    if (node) {
      node.color = Color.BLACK;
    }
  }

  private rotateLeft(node: RBNode<T>): void {
    const right = node.right!;
    node.right = right.left;

    if (right.left !== null) {
      right.left.parent = node;
    }

    right.parent = node.parent;

    if (node.parent === null) {
      this.root = right;
    } else if (node === node.parent.left) {
      node.parent.left = right;
    } else {
      node.parent.right = right;
    }

    right.left = node;
    node.parent = right;

    // Update maxEnd after rotation
    this.updateMaxEnd(node);
    this.updateMaxEnd(right);
  }

  private rotateRight(node: RBNode<T>): void {
    const left = node.left!;
    node.left = left.right;

    if (left.right !== null) {
      left.right.parent = node;
    }

    left.parent = node.parent;

    if (node.parent === null) {
      this.root = left;
    } else if (node === node.parent.right) {
      node.parent.right = left;
    } else {
      node.parent.left = left;
    }

    left.right = node;
    node.parent = left;

    // Update maxEnd after rotation
    this.updateMaxEnd(node);
    this.updateMaxEnd(left);
  }

  private getColor(node: RBNode<T> | null | undefined): Color {
    if (node === null || node === undefined) return Color.BLACK;
    return node.color;
  }

  private verifyMaxEnd(node: RBNode<T> | null): boolean {
    if (node === null) return true;

    let expectedMax = node.end;
    if (node.left !== null) {
      expectedMax = Math.max(expectedMax, node.left.maxEnd);
    }
    if (node.right !== null) {
      expectedMax = Math.max(expectedMax, node.right.maxEnd);
    }

    if (expectedMax !== node.maxEnd) {
      console.error(`maxEnd mismatch at node (${node.start}, ${node.end}): expected ${expectedMax}, got ${node.maxEnd}`);
      return false;
    }

    return this.verifyMaxEnd(node.left) && this.verifyMaxEnd(node.right);
  }

  private verifyRBProperties(node: RBNode<T> | null): { valid: boolean; blackHeight: number } {
    if (node === null) {
      return { valid: true, blackHeight: 1 };
    }

    // Check color property
    if (node.color === Color.RED) {
      if (node.left?.color === Color.RED || node.right?.color === Color.RED) {
        console.error('Red-Black property violated: red node has red child');
        return { valid: false, blackHeight: 0 };
      }
    }

    const leftResult = this.verifyRBProperties(node.left);
    const rightResult = this.verifyRBProperties(node.right);

    if (!leftResult.valid || !rightResult.valid) {
      return { valid: false, blackHeight: 0 };
    }

    if (leftResult.blackHeight !== rightResult.blackHeight) {
      console.error('Red-Black property violated: different black heights');
      return { valid: false, blackHeight: 0 };
    }

    const blackHeight = leftResult.blackHeight + (node.color === Color.BLACK ? 1 : 0);
    return { valid: true, blackHeight };
  }
}
