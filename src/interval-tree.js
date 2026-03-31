// interval-tree.js — Augmented BST for interval queries

class Node {
  constructor(low, high, data = null) {
    this.low = low;
    this.high = high;
    this.data = data;
    this.max = high; // Max high in subtree
    this.left = null;
    this.right = null;
  }
}

export class IntervalTree {
  constructor() { this._root = null; this._size = 0; }
  get size() { return this._size; }

  insert(low, high, data) {
    this._root = this._insert(this._root, low, high, data);
    this._size++;
    return this;
  }

  _insert(node, low, high, data) {
    if (!node) return new Node(low, high, data);
    if (low < node.low) node.left = this._insert(node.left, low, high, data);
    else node.right = this._insert(node.right, low, high, data);
    node.max = Math.max(node.max, high);
    return node;
  }

  // Find all intervals containing point
  queryPoint(point) {
    const results = [];
    this._queryPoint(this._root, point, results);
    return results;
  }

  _queryPoint(node, point, results) {
    if (!node) return;
    if (point >= node.low && point <= node.high) {
      results.push({ low: node.low, high: node.high, data: node.data });
    }
    if (node.left && node.left.max >= point) {
      this._queryPoint(node.left, point, results);
    }
    this._queryPoint(node.right, point, results);
  }

  // Find all intervals overlapping [low, high]
  queryRange(low, high) {
    const results = [];
    this._queryRange(this._root, low, high, results);
    return results;
  }

  _queryRange(node, low, high, results) {
    if (!node) return;
    if (node.low <= high && node.high >= low) {
      results.push({ low: node.low, high: node.high, data: node.data });
    }
    if (node.left && node.left.max >= low) {
      this._queryRange(node.left, low, high, results);
    }
    if (node.right && node.low <= high) {
      this._queryRange(node.right, low, high, results);
    }
  }

  // Check if any interval overlaps
  overlaps(low, high) {
    return this._overlaps(this._root, low, high);
  }

  _overlaps(node, low, high) {
    if (!node) return false;
    if (node.low <= high && node.high >= low) return true;
    if (node.left && node.left.max >= low) return this._overlaps(node.left, low, high);
    return this._overlaps(node.right, low, high);
  }

  // All intervals
  toArray() {
    const result = [];
    this._inOrder(this._root, result);
    return result;
  }

  _inOrder(node, result) {
    if (!node) return;
    this._inOrder(node.left, result);
    result.push({ low: node.low, high: node.high, data: node.data });
    this._inOrder(node.right, result);
  }
}
