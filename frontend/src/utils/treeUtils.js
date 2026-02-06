/**
 * Get path from root to the node with the given value (for highlighting during traversal).
 * @param {{ nodes: { value: number, x: number, y: number }[], edges: { from: string, to: string }[] }} tree
 * @param {number} value
 * @returns {number[]} path from root to node (inclusive)
 */
export function getPathFromRoot(tree, value) {
  const { nodes = [], edges = [] } = tree;
  if (!nodes.length || value == null) return [];

  const coordToValue = {};
  nodes.forEach((n) => {
    coordToValue[`${n.x},${n.y}`] = n.value;
  });

  const toCoords = new Set(edges.map((e) => e.to));
  const rootNode = nodes.find((n) => !toCoords.has(`${n.x},${n.y}`));
  if (!rootNode) return [];

  const parentOf = {};
  edges.forEach((e) => {
    const childVal = coordToValue[e.to];
    const parentVal = coordToValue[e.from];
    if (childVal != null && parentVal != null) parentOf[childVal] = parentVal;
  });

  const path = [];
  let v = value;
  while (v != null) {
    path.push(v);
    if (v === rootNode.value) break;
    v = parentOf[v];
  }
  return path.reverse();
}
