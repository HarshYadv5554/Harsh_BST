import React from 'react';

const NODE_R = 22;
const LEVEL_HEIGHT = 70;

function TreeCanvas({ tree, currentTraversalIndex, traversalSequence }) {
  const { nodes = [], edges = [], n = 0, h = 0 } = tree;

  const currentNode = traversalSequence && traversalSequence[currentTraversalIndex];

  return (
    <div className="flex-1 flex flex-col items-center justify-start pt-4 bg-[#eaeaea] min-h-0 overflow-auto">
      {nodes.length > 0 && (
        <div className="text-black text-sm font-medium mb-2">
          N={n}, h={h}
        </div>
      )}
      <svg
        className="flex-shrink-0"
        width="1000"
        height={Math.max(400, h * LEVEL_HEIGHT + 120)}
        viewBox={`0 0 1000 ${Math.max(400, h * LEVEL_HEIGHT + 120)}`}
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {edges.map((e, i) => {
          const [x1, y1] = (e.from || '').split(',').map(Number);
          const [x2, y2] = (e.to || '').split(',').map(Number);
          const hi = e.highlighted;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={hi ? '#dd6e00' : '#333'}
              strokeWidth={hi ? 2.5 : 1.5}
            />
          );
        })}
        {nodes.map((node) => {
          const isCurrentVisit = currentNode !== undefined && node.value === currentNode;
          const highlighted = node.highlighted || isCurrentVisit;
          return (
            <g key={node.id}>
              {isCurrentVisit && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={NODE_R + 4}
                  fill="none"
                  stroke="#dd6e00"
                  strokeWidth={2}
                  opacity={0.9}
                  style={{ filter: 'url(#glow)' }}
                >
                  <animate
                    attributeName="r"
                    values={`${NODE_R + 2};${NODE_R + 8};${NODE_R + 2}`}
                    dur="1.2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.5;0.9;0.5"
                    dur="1.2s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
              {highlighted && !isCurrentVisit && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={NODE_R + 4}
                  fill="none"
                  stroke="#dd6e00"
                  strokeWidth={2}
                  opacity={0.8}
                  style={{ filter: 'url(#glow)' }}
                />
              )}
              <circle
                cx={node.x}
                cy={node.y}
                r={NODE_R}
                fill={highlighted ? '#dd6e00' : '#fff'}
                stroke={highlighted ? '#b85a00' : '#333'}
                strokeWidth={1.5}
              />
              <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={highlighted ? '#fff' : '#000'}
                fontSize="14"
                fontWeight="500"
              >
                {node.value}
              </text>
              {isCurrentVisit && (
                <path
                  d={`M ${node.x} ${node.y + NODE_R + 6} L ${node.x - 5} ${node.y + NODE_R + 12} L ${node.x + 5} ${node.y + NODE_R + 12} Z`}
                  fill="#dc2626"
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default TreeCanvas;
