/**
 * Generic IntervalTree implementation in TypeScript
 * Supports insert, remove, and search by point operations
 */
export class IntervalTree {
    constructor() {
        this.root = null;
    }
    /**
     * Insert an interval into the tree
     */
    insert(start, end, value) {
        const interval = { start, end, value };
        this.root = this.insertNode(this.root, interval);
    }
    /**
     * Remove an interval from the tree by value reference
     */
    remove(value) {
        const removed = this.removeNode(this.root, value);
        this.root = removed;
        return removed !== null;
    }
    /**
     * Find all intervals containing a given point
     */
    search(point) {
        const result = [];
        this.searchNode(this.root, point, result);
        return result;
    }
    /**
     * Find interval containing the given start point (only)
     */
    findByStart(point) {
        return this.findByStartNode(this.root, point);
    }
    /**
     * Find interval containing the given end point (only)
     */
    findByEnd(point) {
        return this.findByEndNode(this.root, point);
    }
    /**
     * Check if an interval exists with this value
     */
    has(value) {
        return this.findNode(this.root, value) !== null;
    }
    /**
     * Get all intervals (for iteration)
     */
    getAll() {
        const result = [];
        this.inOrderTraversal(this.root, result);
        return result;
    }
    /**
     * Clear all intervals
     */
    clear() {
        this.root = null;
    }
    /**
     * Get the size of the tree
     */
    get size() {
        return this.countNodes(this.root);
    }
    // Private methods
    insertNode(node, interval) {
        if (node === null) {
            return new Node(interval, null, null);
        }
        if (interval.start < node.interval.start) {
            node.left = this.insertNode(node.left, interval);
        }
        else if (interval.start > node.interval.start) {
            node.right = this.insertNode(node.right, interval);
        }
        else if (interval.end > node.interval.end) {
            node.right = this.insertNode(node.right, interval);
        }
        else {
            // Same start and end - replace the value
            node.interval = interval;
        }
        node.height = this.updateHeight(node);
        return this.rebalance(node);
    }
    removeNode(node, value) {
        if (node === null)
            return null;
        if (this.isLess(value, node.interval.value)) {
            node.left = this.removeNode(node.left, value);
        }
        else if (this.isGreater(value, node.interval.value)) {
            node.right = this.removeNode(node.right, value);
        }
        else {
            // Found the node to remove
            if (node.left === null)
                return node.right;
            if (node.right === null)
                return node.left;
            // Node has two children - replace with inorder successor
            const successor = this.findMin(node.right);
            node.interval = successor.interval;
            node.right = this.removeNode(node.right, successor.interval.value);
        }
        if (node === null)
            return null;
        node.height = this.updateHeight(node);
        return this.rebalance(node);
    }
    findMin(node) {
        while (node.left !== null) {
            node = node.left;
        }
        return node;
    }
    findNode(node, value) {
        if (node === null)
            return null;
        if (this.isLess(value, node.interval.value)) {
            return this.findNode(node.left, value);
        }
        else if (this.isGreater(value, node.interval.value)) {
            return this.findNode(node.right, value);
        }
        return node;
    }
    findByStartNode(node, point) {
        if (node === null)
            return null;
        if (point < node.interval.start) {
            return this.findByStartNode(node.left, point);
        }
        else if (point > node.interval.start) {
            // Point might be in left subtree or right subtree
            const leftResult = this.findByStartNode(node.left, point);
            if (leftResult !== null)
                return leftResult;
            return this.findByStartNode(node.right, point);
        }
        else {
            return node.interval;
        }
    }
    findByEndNode(node, point) {
        if (node === null)
            return null;
        if (point < node.interval.start) {
            return this.findByEndNode(node.left, point);
        }
        else if (point > node.interval.start) {
            const leftResult = this.findByEndNode(node.left, point);
            if (leftResult !== null)
                return leftResult;
            return this.findByEndNode(node.right, point);
        }
        else {
            // Point matches start, check if end >= point
            if (point <= node.interval.end) {
                return node.interval;
            }
            return null;
        }
    }
    searchNode(node, point, result) {
        if (node === null)
            return;
        // Check if current node contains the point
        if (point >= node.interval.start && point <= node.interval.end) {
            result.push(node.interval);
        }
        // Search in subtrees
        if (node.left !== null && point >= node.interval.start) {
            this.searchNode(node.left, point, result);
        }
        if (node.right !== null && point <= node.interval.end) {
            this.searchNode(node.right, point, result);
        }
    }
    inOrderTraversal(node, result) {
        if (node === null)
            return;
        this.inOrderTraversal(node.left, result);
        result.push(node.interval);
        this.inOrderTraversal(node.right, result);
    }
    updateHeight(node) {
        const leftHeight = node.left ? node.left.height : 0;
        const rightHeight = node.right ? node.right.height : 0;
        return Math.max(leftHeight, rightHeight) + 1;
    }
    getBalance(node) {
        if (!node)
            return 0;
        const leftHeight = node.left ? node.left.height : 0;
        const rightHeight = node.right ? node.right.height : 0;
        return leftHeight - rightHeight;
    }
    rebalance(node) {
        const balance = this.getBalance(node);
        // Left heavy
        if (balance > 1) {
            if (node.left && this.getBalance(node.left) < 0) {
                node = this.rightRotate(node);
            }
            else {
                node = this.leftRotate(node);
            }
        }
        // Right heavy
        else if (balance < -1) {
            if (node.right && this.getBalance(node.right) > 0) {
                node = this.leftRotate(node);
            }
            else {
                node = this.rightRotate(node);
            }
        }
        return node;
    }
    leftRotate(node) {
        const newRoot = node.right;
        const temp = newRoot.left;
        newRoot.left = node;
        node.right = temp;
        node.height = this.updateHeight(node);
        newRoot.height = this.updateHeight(newRoot);
        return newRoot;
    }
    rightRotate(node) {
        const newRoot = node.left;
        const temp = newRoot.right;
        newRoot.right = node;
        node.left = temp;
        node.height = this.updateHeight(node);
        newRoot.height = this.updateHeight(newRoot);
        return newRoot;
    }
    countNodes(node) {
        if (!node)
            return 0;
        return 1 + this.countNodes(node.left) + this.countNodes(node.right);
    }
    isLess(a, b) {
        return a < b;
    }
    isGreater(a, b) {
        return a > b;
    }
}
class Node {
    constructor(interval, left = null, right = null) {
        this.left = null;
        this.right = null;
        this.height = 1;
        this.interval = interval;
        this.left = left;
        this.right = right;
        this.height = 1;
    }
}
export default IntervalTree;
