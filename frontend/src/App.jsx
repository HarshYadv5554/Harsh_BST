import React, { useState, useEffect, useRef } from 'react';
import { getTree, highlightPath } from './utils/api';
import { getPathFromRoot } from './utils/treeUtils';
import Controls, { OP } from './components/Controls';
import TreeCanvas from './components/TreeCanvas';
import TraversalPanel from './components/TraversalPanel';

const TRAVERSAL_BASE_MS = 1200; // 1x = 1.2s per step

function App() {
  const [tree, setTree] = useState({ nodes: [], edges: [], n: 0, h: 0 });
  const [activeOp, setActiveOp] = useState(OP.CREATE);
  const [loading, setLoading] = useState(false);
  const [traversal, setTraversal] = useState(null); // { type, sequence }
  const [traversalIndex, setTraversalIndex] = useState(0);
  const [isTraversalPlaying, setIsTraversalPlaying] = useState(false);
  const [traversalSpeed, setTraversalSpeed] = useState(1); // 0.5 to 2
  const traversalRef = useRef({ traversal, traversalIndex, tree });
  traversalRef.current = { traversal, traversalIndex, tree };

  const fetchTree = async () => {
    try {
      const res = await getTree();
      if (res.data && res.data.nodes) setTree(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchTree();
  }, []);

  const onTreeUpdate = (newTree) => {
    if (newTree && (newTree.nodes || newTree.n !== undefined)) setTree(newTree);
  };

  const onTraversalStart = (type, sequence, treeSnapshot) => {
    setTraversal({ type, sequence });
    setTraversalIndex(0);
    setIsTraversalPlaying(true); // auto-start playback
    const treeForPath = treeSnapshot && treeSnapshot.nodes ? treeSnapshot : tree;
    if (sequence.length > 0) {
      const pathToFirst = getPathFromRoot(treeForPath, sequence[0]);
      highlightPath(pathToFirst).then((r) => r.data && setTree(r.data));
    }
  };

  const traversalStep = (delta) => {
    if (!traversal) return;
    const next = Math.max(0, Math.min(traversalIndex + delta, traversal.sequence.length));
    setTraversalIndex(next);
    if (next < traversal.sequence.length) {
      const pathToNode = getPathFromRoot(tree, traversal.sequence[next]);
      highlightPath(pathToNode).then((r) => r.data && setTree(r.data));
    } else {
      highlightPath([]).then((r) => r.data && setTree(r.data));
    }
  };

  // Auto-advance traversal at interval (speed-controlled)
  useEffect(() => {
    if (!traversal || !isTraversalPlaying) return;
    const stepMs = TRAVERSAL_BASE_MS / traversalSpeed;
    const id = setInterval(() => {
      const { traversal: t, traversalIndex: i, tree: tr } = traversalRef.current;
      if (!t || i >= t.sequence.length) {
        setIsTraversalPlaying(false);
        return;
      }
      const next = i + 1;
      traversalRef.current.traversalIndex = next;
      setTraversalIndex(next);
      if (next < t.sequence.length) {
        const path = getPathFromRoot(tr, t.sequence[next]);
        highlightPath(path).then((r) => r.data && setTree(r.data));
      } else {
        highlightPath([]).then((r) => r.data && setTree(r.data));
        setIsTraversalPlaying(false);
      }
    }, stepMs);
    return () => clearInterval(id);
  }, [traversal, isTraversalPlaying, traversalSpeed]);

  return (
    <div className="flex flex-col h-screen bg-[#eaeaea]">
      {/* Header - black bar */}
      <header className="flex-shrink-0 h-12 bg-black flex items-center justify-between px-4">
        <div className="flex items-center gap-3 text-white text-sm">
          <span className="font-bold">VISUALGO.NET</span>
          <span className="text-gray-400">/en</span>
          <span className="text-gray-400">▾</span>
          <span className="text-gray-400">/bst</span>
          <span className="font-medium">BINARY SEARCH TREE</span>
          <span className="text-gray-300">AVL TREE</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white text-sm">Exploration Mode</span>
          <span className="text-gray-400">▾</span>
          <button
            type="button"
            className="px-4 py-1.5 bg-[#22c55e] text-white text-sm font-medium rounded"
          >
            LOGIN
          </button>
        </div>
      </header>

      {/* Body: sidebar + main + optional traversal panel */}
      <div className="flex flex-1 min-h-0">
        <Controls
          activeOp={activeOp}
          onOpChange={setActiveOp}
          onTreeUpdate={onTreeUpdate}
          onTraversalStart={onTraversalStart}
          loading={loading}
          setLoading={setLoading}
        >
          <div className="flex-1 min-h-0 flex flex-col">
            <TreeCanvas
              tree={tree}
              currentTraversalIndex={traversalIndex}
              traversalSequence={traversal ? traversal.sequence : null}
            />
          </div>
        </Controls>
        {traversal && (
          <TraversalPanel
            type={traversal.type}
            sequence={traversal.sequence}
            currentIndex={traversalIndex}
            isPlaying={isTraversalPlaying}
            onPlayPause={() => setIsTraversalPlaying((p) => !p)}
            speed={traversalSpeed}
            onSpeedChange={setTraversalSpeed}
            onPrev={() => traversalStep(-1)}
            onNext={() => traversalStep(1)}
            onClose={() => setTraversal(null)}
          />
        )}
      </div>

      {/* Footer - black bar */}
      <footer className="flex-shrink-0 h-6 bg-black" />
    </div>
  );
}

export default App;
