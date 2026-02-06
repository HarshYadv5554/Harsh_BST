import React, { useState } from 'react';
import {
  insert as apiInsert,
  search as apiSearch,
  remove as apiRemove,
  getMin,
  getMax,
  getPredecessor,
  getSuccessor,
  selectK,
  createEmpty,
  createRandom,
  createExamples,
  getInorder,
  getPreorder,
  getPostorder,
  clearHighlight,
} from '../utils/api';

const OP = {
  LAYOUT: 'layout',
  CREATE: 'create',
  SEARCH: 'search',
  INSERT: 'insert',
  REMOVE: 'remove',
  PRED_SUCC: 'pred_succ',
  SELECT: 'select',
  TRAVERSE: 'traverse',
};

function Controls({
  activeOp,
  onOpChange,
  onTreeUpdate,
  onTraversalStart,
  loading,
  setLoading,
  children,
}) {
  const [createN, setCreateN] = useState('23');
  const [searchV, setSearchV] = useState('');
  const [insertV, setInsertV] = useState('');
  const [removeV, setRemoveV] = useState('');
  const [predSuccV, setPredSuccV] = useState('');
  const [selectKVal, setSelectKVal] = useState('');

  const run = async (fn) => {
    setLoading(true);
    try {
      const res = await fn();
      if (res.data && (res.data.tree || res.data.nodes !== undefined))
        onTreeUpdate(res.data.tree || res.data);
      return res.data;
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmpty = () => run(createEmpty).then((d) => d && onTreeUpdate(d));
  const handleCreateExamples = () => run(createExamples).then((d) => d && onTreeUpdate(d));
  const handleCreateRandom = () =>
    run(() => createRandom(createN)).then((d) => d && onTreeUpdate(d));

  const handleSearch = (mode) => () => {
    const v = Number(searchV);
    if (Number.isNaN(v)) return;
    run(() => apiSearch(v, mode)).then((d) => d && onTreeUpdate(d.tree));
  };

  const handleInsert = () => {
    const raw = insertV.replace(/\s/g, '');
    if (!raw) return;
    const values = raw.split(',').map((s) => Number(s.trim())).filter((n) => !Number.isNaN(n));
    if (!values.length) return;
    run(() => apiInsert(values)).then((d) => d && onTreeUpdate(d.tree));
  };

  const handleRemove = () => {
    const raw = removeV.replace(/\s/g, '');
    if (!raw) return;
    const values = raw.split(',').map((s) => Number(s.trim())).filter((n) => !Number.isNaN(n));
    if (!values.length) return;
    run(() => apiRemove(values)).then((d) => d && onTreeUpdate(d.tree));
  };

  const handlePredecessor = () => {
    const v = Number(predSuccV);
    if (Number.isNaN(v)) return;
    run(() => getPredecessor(v)).then((d) => d && onTreeUpdate(d.tree));
  };

  const handleSuccessor = () => {
    const v = Number(predSuccV);
    if (Number.isNaN(v)) return;
    run(() => getSuccessor(v)).then((d) => d && onTreeUpdate(d.tree));
  };

  const handleSelectK = () => {
    const k = parseInt(selectKVal, 10);
    if (Number.isNaN(k) || k < 1) return;
    run(() => selectK(k)).then((d) => d && onTreeUpdate(d.tree));
  };

  const handleTraversal = (order) => async () => {
    const fn = order === 'inorder' ? getInorder : order === 'preorder' ? getPreorder : getPostorder;
    const res = await run(fn);
    if (res && res.sequence) onTraversalStart(order, res.sequence, res.tree);
  };

  const sidebarOps = [
    { id: OP.LAYOUT, label: 'Toggle BST Layout' },
    { id: OP.CREATE, label: 'Create' },
    { id: OP.SEARCH, label: 'Search(v)' },
    { id: OP.INSERT, label: 'Insert(v)' },
    { id: OP.REMOVE, label: 'Remove(v)' },
    { id: OP.PRED_SUCC, label: 'Predec-/Succ-essor(v)' },
    { id: OP.SELECT, label: 'Select(k)' },
    { id: OP.TRAVERSE, label: 'Traverse(root)' },
  ];

  return (
    <div className="flex flex-1 min-h-0">
      {/* Left sidebar */}
      <div className="flex flex-shrink-0">
        <button
          type="button"
          className="w-8 flex-shrink-0 bg-black/20 flex items-center justify-center text-gray-300 hover:bg-black/30"
          title="Collapse sidebar"
        >
          ‹
        </button>
        <div className="w-52 bg-[#dd6e00] flex flex-col py-2">
          {sidebarOps.map((op) => (
            <button
              key={op.id}
              type="button"
              onClick={() => onOpChange(op.id)}
              className={`text-left px-4 py-2.5 text-white text-sm font-medium uppercase tracking-wide ${
                activeOp === op.id ? 'bg-black' : 'hover:bg-black/20'
              }`}
            >
              {op.label}
            </button>
          ))}
          {activeOp === OP.TRAVERSE && (
            <div className="mt-2 px-2 flex flex-col gap-1">
              <button
                type="button"
                onClick={handleTraversal('inorder')}
                className="text-left px-3 py-2 text-white text-sm bg-black rounded"
              >
                Inorder(root)
              </button>
              <button
                type="button"
                onClick={handleTraversal('preorder')}
                className="text-left px-3 py-2 text-white text-sm bg-[#dd6e00] hover:bg-black/80 rounded"
              >
                Preorder(root)
              </button>
              <button
                type="button"
                onClick={handleTraversal('postorder')}
                className="text-left px-3 py-2 text-white text-sm bg-[#dd6e00] hover:bg-black/80 rounded"
              >
                Postorder(root)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main content area - controls row */}
      <div className="flex-1 bg-[#eaeaea] flex flex-col min-w-0">
        <div className="flex-shrink-0 px-4 py-3 flex flex-wrap items-center gap-3 bg-[#eaeaea]">
          {activeOp === OP.CREATE && (
            <>
              <button
                type="button"
                onClick={handleCreateEmpty}
                className="px-4 py-2 bg-[#dd6e00] text-white text-sm font-medium rounded hover:bg-[#c96300]"
              >
                Empty
              </button>
              <button
                type="button"
                onClick={handleCreateExamples}
                className="px-4 py-2 bg-[#dd6e00] text-white text-sm font-medium rounded hover:bg-[#c96300]"
              >
                Examples
              </button>
              <span className="text-black text-sm">N =</span>
              <input
                type="number"
                value={createN}
                onChange={(e) => setCreateN(e.target.value)}
                className="w-20 h-9 px-2 bg-black text-white rounded text-sm"
                min={1}
                max={50}
              />
              <button
                type="button"
                onClick={handleCreateRandom}
                className="px-4 py-2 bg-[#dd6e00] text-white text-sm font-medium rounded hover:bg-[#c96300]"
              >
                Random
              </button>
            </>
          )}

          {activeOp === OP.SEARCH && (
            <>
              <span className="text-black text-sm">v =</span>
              <input
                type="number"
                value={searchV}
                onChange={(e) => setSearchV(e.target.value)}
                className="w-24 h-9 px-2 bg-black text-white rounded text-sm"
              />
              <button
                type="button"
                onClick={handleSearch('exact')}
                className="px-4 py-2 bg-[#dd6e00] text-white text-sm font-medium rounded hover:bg-[#c96300]"
              >
                Exact
              </button>
              <button
                type="button"
                onClick={handleSearch('lower_bound')}
                className="px-4 py-2 bg-[#dd6e00] text-white text-sm font-medium rounded hover:bg-[#c96300]"
              >
                lower_bound
              </button>
              <span className="text-black text-sm">Extreme:</span>
              <button
                type="button"
                onClick={() => run(getMin).then((d) => d && onTreeUpdate(d.tree))}
                className="px-4 py-2 bg-[#dd6e00] text-white text-sm font-medium rounded hover:bg-[#c96300]"
              >
                Min
              </button>
              <button
                type="button"
                onClick={() => run(getMax).then((d) => d && onTreeUpdate(d.tree))}
                className="px-4 py-2 bg-[#dd6e00] text-white text-sm font-medium rounded hover:bg-[#c96300]"
              >
                Max
              </button>
            </>
          )}

          {activeOp === OP.INSERT && (
            <>
              <span className="text-black text-sm">v =</span>
              <input
                type="text"
                value={insertV}
                onChange={(e) => setInsertV(e.target.value)}
                placeholder="e.g. 18,37"
                className="w-32 h-9 px-2 bg-black text-white rounded text-sm placeholder-gray-400"
              />
              <button
                type="button"
                onClick={handleInsert}
                className="px-4 py-2 bg-[#dd6e00] text-white text-sm font-medium rounded hover:bg-[#c96300]"
              >
                Go
              </button>
            </>
          )}

          {activeOp === OP.REMOVE && (
            <>
              <span className="text-black text-sm">v =</span>
              <input
                type="text"
                value={removeV}
                onChange={(e) => setRemoveV(e.target.value)}
                placeholder="e.g. 59,62"
                className="w-32 h-9 px-2 bg-black text-white rounded text-sm placeholder-gray-400"
              />
              <button
                type="button"
                onClick={handleRemove}
                className="px-4 py-2 bg-[#dd6e00] text-white text-sm font-medium rounded hover:bg-[#c96300]"
              >
                Go
              </button>
            </>
          )}

          {activeOp === OP.PRED_SUCC && (
            <>
              <span className="text-black text-sm">v =</span>
              <input
                type="number"
                value={predSuccV}
                onChange={(e) => setPredSuccV(e.target.value)}
                className="w-24 h-9 px-2 bg-black text-white rounded text-sm"
              />
              <button
                type="button"
                onClick={handlePredecessor}
                className="px-4 py-2 bg-[#dd6e00] text-white text-sm font-medium rounded hover:bg-[#c96300]"
              >
                Get Predecessor
              </button>
              <button
                type="button"
                onClick={handleSuccessor}
                className="px-4 py-2 bg-[#dd6e00] text-white text-sm font-medium rounded hover:bg-[#c96300]"
              >
                Get Successor
              </button>
            </>
          )}

          {activeOp === OP.SELECT && (
            <>
              <span className="text-black text-sm">k =</span>
              <input
                type="number"
                value={selectKVal}
                onChange={(e) => setSelectKVal(e.target.value)}
                className="w-16 h-9 px-2 bg-black text-white rounded text-sm"
                min={1}
              />
              <button
                type="button"
                onClick={handleSelectK}
                className="px-4 py-2 bg-[#dd6e00] text-white text-sm font-medium rounded hover:bg-[#c96300]"
              >
                Go
              </button>
            </>
          )}

          {(activeOp === OP.LAYOUT || activeOp === OP.TRAVERSE) && activeOp !== OP.TRAVERSE && (
            <span className="text-gray-600 text-sm">Select an operation from the sidebar.</span>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}

export default Controls;
export { OP };
