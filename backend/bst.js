/**
 * Binary Search Tree implementation with path tracking and serialization for visualization.
 */
class BSTNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BST {
  constructor() {
    this.root = null;
    this.highlightedPath = [];
    this.highlightedNodes = new Set();
  }

  insert(value) {
    const path = [];
    const newNode = new BSTNode(value);

    if (!this.root) {
      this.root = newNode;
      path.push(value);
      return { inserted: true, path };
    }

    let current = this.root;
    while (true) {
      path.push(current.value);
      if (value < current.value) {
        if (!current.left) {
          current.left = newNode;
          path.push(value);
          return { inserted: true, path };
        }
        current = current.left;
      } else if (value > current.value) {
        if (!current.right) {
          current.right = newNode;
          path.push(value);
          return { inserted: true, path };
        }
        current = current.right;
      } else {
        return { inserted: false, path };
      }
    }
  }

  search(value, mode = 'exact') {
    const path = [];
    let current = this.root;

    while (current) {
      path.push(current.value);
      if (value === current.value) {
        return { found: true, path, node: current.value };
      }
      if (value < current.value) {
        if (mode === 'lower_bound' && !current.left) return { found: false, path, lowerBound: current.value };
        current = current.left;
      } else {
        if (mode === 'lower_bound' && !current.right) return { found: false, path, lowerBound: null };
        current = current.right;
      }
    }
    return { found: false, path };
  }

  findMin(node = this.root) {
    if (!node) return null;
    const path = [];
    let current = node;
    while (current.left) {
      path.push(current.value);
      current = current.left;
    }
    path.push(current.value);
    return { value: current.value, path };
  }

  findMax(node = this.root) {
    if (!node) return null;
    const path = [];
    let current = node;
    while (current.right) {
      path.push(current.value);
      current = current.right;
    }
    path.push(current.value);
    return { value: current.value, path };
  }

  remove(value) {
    const path = [];
    this.root = this._removeNode(this.root, value, path);
    return { path };
  }

  _removeNode(node, value, path) {
    if (!node) return null;
    path.push(node.value);

    if (value < node.value) {
      node.left = this._removeNode(node.left, value, path);
      return node;
    }
    if (value > node.value) {
      node.right = this._removeNode(node.right, value, path);
      return node;
    }

    if (!node.left) return node.right;
    if (!node.right) return node.left;

    const minRight = this.findMin(node.right);
    node.value = minRight.value;
    node.right = this._removeNode(node.right, minRight.value, path);
    return node;
  }

  predecessor(value) {
    const path = [];
    let current = this.root;
    let pred = null;

    while (current) {
      path.push(current.value);
      if (value <= current.value) {
        current = current.left;
      } else {
        pred = current.value;
        current = current.right;
      }
    }
    return { found: pred !== null, value: pred, path };
  }

  successor(value) {
    const path = [];
    let current = this.root;
    let succ = null;

    while (current) {
      path.push(current.value);
      if (value >= current.value) {
        current = current.right;
      } else {
        succ = current.value;
        current = current.left;
      }
    }
    return { found: succ !== null, value: succ, path };
  }

  select(k) {
    const inorder = this._inorderValues(this.root);
    const value = inorder[k - 1];
    if (value === undefined) return { found: false, path: [], value: null };
    const searchResult = this.search(value);
    return { found: true, value, path: searchResult.path };
  }

  _inorderValues(node, acc = []) {
    if (!node) return acc;
    this._inorderValues(node.left, acc);
    acc.push(node.value);
    this._inorderValues(node.right, acc);
    return acc;
  }

  inorder() {
    return this._traversal(this.root, 'inorder');
  }

  preorder() {
    return this._traversal(this.root, 'preorder');
  }

  postorder() {
    return this._traversal(this.root, 'postorder');
  }

  _traversal(node, order, acc = []) {
    if (!node) return acc;
    if (order === 'preorder') acc.push(node.value);
    this._traversal(node.left, order, acc);
    if (order === 'inorder') acc.push(node.value);
    this._traversal(node.right, order, acc);
    if (order === 'postorder') acc.push(node.value);
    return acc;
  }

  toVisualization() {
    const nodes = [];
    const edges = [];
    const levelWidth = 320;
    const levelHeight = 70;

    const traverse = (node, x, y, level, parentX, parentY) => {
      if (!node) return;
      nodes.push({
        id: node.value,
        value: node.value,
        x,
        y,
        highlighted: this.highlightedPath.includes(node.value) || this.highlightedNodes.has(node.value),
      });
      if (parentX != null && parentY != null) {
        edges.push({
          from: parentX + ',' + parentY,
          to: x + ',' + y,
          fromVal: null,
          toVal: node.value,
          highlighted: this.highlightedPath.includes(node.value),
        });
      }
      const spread = levelWidth / Math.pow(2, level);
      if (node.left) traverse(node.left, x - spread, y + levelHeight, level + 1, x, y);
      if (node.right) traverse(node.right, x + spread, y + levelHeight, level + 1, x, y);
    };

    if (this.root) {
      const startX = 500;
      const startY = 50;
      traverse(this.root, startX, startY, 1, null, null);
    }

    const height = this._height(this.root);
    const count = this._count(this.root);
    return { nodes, edges, n: count, h: height };
  }

  _height(node) {
    if (!node) return 0;
    return 1 + Math.max(this._height(node.left), this._height(node.right));
  }

  _count(node) {
    if (!node) return 0;
    return 1 + this._count(node.left) + this._count(node.right);
  }

  setHighlightPath(path) {
    this.highlightedPath = Array.isArray(path) ? path : [];
  }

  setHighlightNodes(nodes) {
    this.highlightedNodes = new Set(Array.isArray(nodes) ? nodes : []);
  }

  clearHighlight() {
    this.highlightedPath = [];
    this.highlightedNodes = new Set();
  }

  clear() {
    this.root = null;
    this.clearHighlight();
  }

  createRandom(n) {
    this.clear();
    const count = Math.min(Math.max(1, parseInt(n, 10) || 10), 50);
    const used = new Set();
    while (used.size < count) {
      used.add(Math.floor(Math.random() * 200) - 50);
    }
    [...used].forEach((v) => this.insert(v));
    return this.toVisualization();
  }

  createEmpty() {
    this.clear();
    return this.toVisualization();
  }
}

module.exports = { BST, BSTNode };
