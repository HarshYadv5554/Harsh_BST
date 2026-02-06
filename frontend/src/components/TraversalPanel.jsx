import React from 'react';

const INORDER_CODE = [
  'if this is null',
  'return',
  'Inorder (left)',
  'visit this',
  'Inorder (right)',
];

const PREORDER_CODE = [
  'if this is null',
  'return',
  'visit this',
  'Preorder (left)',
  'Preorder (right)',
];

const POSTORDER_CODE = [
  'if this is null',
  'return',
  'Postorder (left)',
  'Postorder (right)',
  'visit this',
];

function TraversalPanel({
  type,
  sequence = [],
  currentIndex,
  isPlaying = false,
  onPlayPause,
  speed = 1,
  onSpeedChange,
  onPrev,
  onNext,
  onClose,
}) {
  const title =
    type === 'inorder'
      ? 'Inorder Traversal'
      : type === 'preorder'
        ? 'Preorder Traversal'
        : 'Postorder Traversal';
  const code =
    type === 'inorder' ? INORDER_CODE : type === 'preorder' ? PREORDER_CODE : POSTORDER_CODE;
  const visitLineIndex = code.findIndex((line) => line === 'visit this');
  const currentValue = currentIndex < sequence.length ? sequence[currentIndex] : null;
  const visitedInOrder = currentValue != null
    ? sequence.slice(0, currentIndex + 1)
    : sequence.slice(0, currentIndex);
  const visitedStr = visitedInOrder.join(',');

  return (
    <div className="w-80 flex-shrink-0 bg-[#2d2d2d] flex flex-col border-l border-gray-700 min-w-0">
      <div className="p-3 border-b border-gray-600 flex items-center justify-between flex-shrink-0">
        <span className="text-white font-medium text-sm">{title}</span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white text-lg leading-none"
          >
            ×
          </button>
        )}
      </div>
      <div className="p-3 flex-1 flex flex-col gap-3 min-h-0 overflow-auto">
        {currentValue != null && (
          <div className="bg-[#166534] text-white text-sm p-2 rounded break-words">
            <div>Visit vertex with value {currentValue}.</div>
            {visitedInOrder.length > 0 && (
              <div className="mt-1 break-words" style={{ wordBreak: 'break-word' }}>
                Visitation sequence: {visitedStr}.
              </div>
            )}
          </div>
        )}
        {currentValue == null && sequence.length > 0 && (
          <div className="bg-[#166534] text-white text-sm p-2 rounded break-words" style={{ wordBreak: 'break-word' }}>
            <div>Traversal complete.</div>
            <div className="mt-1">Sequence: {sequence.join(',')}.</div>
          </div>
        )}
        <div className="bg-[#ca8a04] rounded overflow-hidden flex-shrink-0">
          {code.map((line, i) => (
            <div
              key={i}
              className={`px-2 py-1 text-sm font-mono ${
                i === visitLineIndex && currentValue != null
                  ? 'bg-black text-white'
                  : 'bg-[#ca8a04] text-black'
              }`}
            >
              {line}
            </div>
          ))}
        </div>
        <div className="mt-auto space-y-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPlayPause}
              className="w-8 h-8 flex items-center justify-center bg-black text-white rounded text-sm font-medium"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? '‖' : '▶'}
            </button>
            <div className="flex-1 flex items-center gap-2">
              <span className="text-white text-xs tabular-nums">{speed.toFixed(1)}x</span>
              <input
                type="range"
                min={0.5}
                max={2}
                step={0.25}
                value={speed}
                onChange={(e) => onSpeedChange(Number(e.target.value))}
                className="speed-slider flex-1 min-w-0"
              />
              <span className="text-white text-xs tabular-nums">2x</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onPrev}
              disabled={currentIndex <= 0}
              className="w-8 h-8 flex items-center justify-center bg-black text-white rounded disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={currentIndex >= sequence.length}
              className="w-8 h-8 flex items-center justify-center bg-black text-white rounded disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TraversalPanel;
