const express = require('express');
const cors = require('cors');
const { BST } = require('./bst');

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

const bst = new BST();

// Optional: seed with example tree
function seedExample() {
  bst.clear();
  [58, 23, 77, 11, 41, 63, 83, 2, 12, 28, 54, 59, 69, 79, 8, 21, 39, 55, 62, 72, 80, 91].forEach((v) => bst.insert(v));
}
seedExample();

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.get('/api/tree', (req, res) => {
  res.json(bst.toVisualization());
});

app.post('/api/insert', (req, res) => {
  const { values } = req.body;
  const arr = Array.isArray(values) ? values : [].concat(values == null ? [] : [values]);
  const paths = [];
  for (const v of arr) {
    const num = Number(v);
    if (Number.isNaN(num)) continue;
    const result = bst.insert(num);
    paths.push(result.path);
  }
  const lastPath = paths.length ? paths[paths.length - 1] : [];
  bst.setHighlightPath(lastPath);
  res.json({ tree: bst.toVisualization(), lastPath });
});

app.post('/api/search', (req, res) => {
  const { value, mode } = req.body;
  const num = Number(value);
  if (Number.isNaN(num)) return res.status(400).json({ error: 'Invalid value' });
  const result = bst.search(num, mode || 'exact');
  bst.setHighlightPath(result.path);
  res.json({ ...result, tree: bst.toVisualization() });
});

app.delete('/api/remove', (req, res) => {
  const { values } = req.body;
  const arr = Array.isArray(values) ? values : [].concat(values == null ? [] : [values]);
  for (const v of arr) {
    const num = Number(v);
    if (!Number.isNaN(num)) bst.remove(num);
  }
  bst.clearHighlight();
  res.json({ tree: bst.toVisualization() });
});

app.get('/api/min', (req, res) => {
  const result = bst.findMin();
  if (!result) return res.json({ found: false, path: [], value: null, tree: bst.toVisualization() });
  bst.setHighlightPath(result.path);
  res.json({ found: true, ...result, tree: bst.toVisualization() });
});

app.get('/api/max', (req, res) => {
  const result = bst.findMax();
  if (!result) return res.json({ found: false, path: [], value: null, tree: bst.toVisualization() });
  bst.setHighlightPath(result.path);
  res.json({ found: true, ...result, tree: bst.toVisualization() });
});

app.post('/api/predecessor', (req, res) => {
  const { value } = req.body;
  const num = Number(value);
  if (Number.isNaN(num)) return res.status(400).json({ error: 'Invalid value' });
  const result = bst.predecessor(num);
  bst.setHighlightPath(result.path);
  res.json({ ...result, tree: bst.toVisualization() });
});

app.post('/api/successor', (req, res) => {
  const { value } = req.body;
  const num = Number(value);
  if (Number.isNaN(num)) return res.status(400).json({ error: 'Invalid value' });
  const result = bst.successor(num);
  bst.setHighlightPath(result.path);
  res.json({ ...result, tree: bst.toVisualization() });
});

app.post('/api/select', (req, res) => {
  const { k } = req.body;
  const index = Math.max(1, parseInt(k, 10) || 1);
  const result = bst.select(index);
  bst.setHighlightPath(result.path || []);
  res.json({ ...result, tree: bst.toVisualization() });
});

app.get('/api/inorder', (req, res) => {
  const sequence = bst.inorder();
  res.json({ sequence, tree: bst.toVisualization() });
});

app.get('/api/preorder', (req, res) => {
  const sequence = bst.preorder();
  res.json({ sequence, tree: bst.toVisualization() });
});

app.get('/api/postorder', (req, res) => {
  const sequence = bst.postorder();
  res.json({ sequence, tree: bst.toVisualization() });
});

app.post('/api/clear-highlight', (req, res) => {
  bst.clearHighlight();
  res.json(bst.toVisualization());
});

app.post('/api/highlight', (req, res) => {
  const { path } = req.body;
  bst.setHighlightPath(path || []);
  res.json(bst.toVisualization());
});

app.delete('/api/clear', (req, res) => {
  bst.clear();
  res.json(bst.toVisualization());
});

app.post('/api/create/empty', (req, res) => {
  const tree = bst.createEmpty();
  res.json(tree);
});

app.post('/api/create/random', (req, res) => {
  const { n } = req.body;
  const tree = bst.createRandom(n);
  res.json(tree);
});

app.post('/api/create/examples', (req, res) => {
  seedExample();
  bst.clearHighlight();
  res.json(bst.toVisualization());
});

app.listen(PORT, () => {
  console.log(`BST Visualizer API running at http://localhost:${PORT}`);
});
