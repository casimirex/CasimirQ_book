/**
 * A small, dependency-free quantum circuit renderer (SVG).
 * Chapters describe circuits declaratively; this draws them on the qubit wires.
 */

export interface Box {
  wire: number;
  label: string;
  /** family override; otherwise inferred from the label */
  family?: GateFamily;
}

export interface Col {
  boxes?: Box[];
  /** controlled operation: filled dots on `controls`, action on `target` */
  ctrl?: { controls: number[]; target: number; kind?: 'x' | 'z' | 'box'; label?: string; family?: GateFamily };
  swap?: [number, number];
  /** controlled-swap (Fredkin): a control dot linked to a swap on a/b */
  cswap?: { control: number; a: number; b: number };
  measure?: number[];
  barrier?: boolean;
  /** faint column heading, e.g. a step label */
  tag?: string;
}

type GateFamily = 'h' | 'pauli' | 'phase' | 'rot' | 'oracle' | 'meas';

const FAMILY_COLOR: Record<GateFamily, { stroke: string; fill: string; text: string }> = {
  h: { stroke: '#2dd4bf', fill: 'rgba(45,212,191,0.14)', text: '#5eead4' },
  pauli: { stroke: '#22b8f0', fill: 'rgba(34,184,240,0.14)', text: '#7dd3fc' },
  phase: { stroke: '#8b5cf6', fill: 'rgba(139,92,246,0.16)', text: '#c4b5fd' },
  rot: { stroke: '#fbbf24', fill: 'rgba(251,191,36,0.14)', text: '#fcd34d' },
  oracle: { stroke: '#ec4899', fill: 'rgba(236,72,153,0.14)', text: '#f9a8d4' },
  meas: { stroke: '#8fa3bf', fill: 'rgba(143,163,191,0.12)', text: '#cbd5e1' },
};

function inferFamily(label: string): GateFamily {
  const l = label.toUpperCase();
  if (l === 'H') return 'h';
  if (['X', 'Y', 'Z', 'I'].includes(l)) return 'pauli';
  if (l.startsWith('S') || l.startsWith('T') || l.startsWith('P') || l.startsWith('U')) return 'phase';
  if (l.startsWith('R') || l.includes('Θ') || l.includes('φ')) return 'rot';
  return 'oracle';
}

interface Props {
  qubits: string[];
  cols: Col[];
  caption?: string;
  /** classical/aux wires drawn dashed under the last qubit */
  className?: string;
}

export function CircuitDiagram({ qubits, cols, caption, className }: Props) {
  const LEFT = 58;
  const TOP = 34;
  const WIRE = 56;
  const COL = 62;
  const boxW = 40;
  const boxH = 36;

  const nWires = qubits.length;
  const width = LEFT + cols.length * COL + 30;
  const height = TOP + (nWires - 1) * WIRE + 44;

  const yOf = (w: number) => TOP + w * WIRE;
  const xOf = (c: number) => LEFT + c * COL + COL / 2;

  return (
    <figure className={`my-8 ${className ?? ''}`}>
      <div className="overflow-x-auto rounded-xl border border-border bg-gradient-to-b from-surface/80 to-bg/60 p-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          className="mx-auto block max-w-full"
          role="img"
        >
          {/* qubit wires + labels */}
          {qubits.map((q, w) => (
            <g key={w}>
              <text x={14} y={yOf(w) + 4} className="fill-muted font-mono" fontSize={13}>
                {q}
              </text>
              <line
                x1={LEFT - 6}
                y1={yOf(w)}
                x2={width - 14}
                y2={yOf(w)}
                stroke="#2a3d5c"
                strokeWidth={1.5}
              />
            </g>
          ))}

          {cols.map((col, ci) => {
            const cx = xOf(ci);
            const els: JSX.Element[] = [];

            if (col.tag) {
              els.push(
                <text key="tag" x={cx} y={16} textAnchor="middle" className="fill-primary/60 font-mono" fontSize={10}>
                  {col.tag}
                </text>,
              );
            }

            if (col.barrier) {
              els.push(
                <line
                  key="bar"
                  x1={cx}
                  y1={TOP - 22}
                  x2={cx}
                  y2={yOf(nWires - 1) + 22}
                  stroke="#3b5378"
                  strokeWidth={1.4}
                  strokeDasharray="4 4"
                />,
              );
            }

            if (col.ctrl) {
              const { controls, target, kind = 'x', label, family } = col.ctrl;
              const wires = [...controls, target];
              const top = Math.min(...wires);
              const bot = Math.max(...wires);
              els.push(
                <line key="cline" x1={cx} y1={yOf(top)} x2={cx} y2={yOf(bot)} stroke="#7dd3fc" strokeWidth={1.6} />,
              );
              controls.forEach((c) => {
                els.push(<circle key={`c${c}`} cx={cx} cy={yOf(c)} r={5} fill="#7dd3fc" />);
              });
              if (kind === 'x') {
                els.push(
                  <g key="tgt">
                    <circle cx={cx} cy={yOf(target)} r={13} fill="#0b1424" stroke="#7dd3fc" strokeWidth={1.8} />
                    <line x1={cx - 13} y1={yOf(target)} x2={cx + 13} y2={yOf(target)} stroke="#7dd3fc" strokeWidth={1.8} />
                    <line x1={cx} y1={yOf(target) - 13} x2={cx} y2={yOf(target) + 13} stroke="#7dd3fc" strokeWidth={1.8} />
                  </g>,
                );
              } else if (kind === 'z') {
                els.push(<circle key="tgtz" cx={cx} cy={yOf(target)} r={5} fill="#7dd3fc" />);
              } else {
                const fam = family ?? inferFamily(label ?? 'U');
                const col2 = FAMILY_COLOR[fam];
                els.push(
                  <g key="tgtbox">
                    <rect x={cx - boxW / 2} y={yOf(target) - boxH / 2} width={boxW} height={boxH} rx={7} fill={col2.fill} stroke={col2.stroke} strokeWidth={1.6} />
                    <text x={cx} y={yOf(target) + 4.5} textAnchor="middle" fill={col2.text} className="font-mono" fontSize={12.5}>
                      {label}
                    </text>
                  </g>,
                );
              }
            }

            if (col.swap) {
              const [a, b] = col.swap;
              els.push(<line key="sline" x1={cx} y1={yOf(a)} x2={cx} y2={yOf(b)} stroke="#7dd3fc" strokeWidth={1.6} />);
              [a, b].forEach((w) => {
                const y = yOf(w);
                els.push(
                  <g key={`sw${w}`} stroke="#7dd3fc" strokeWidth={2}>
                    <line x1={cx - 7} y1={y - 7} x2={cx + 7} y2={y + 7} />
                    <line x1={cx - 7} y1={y + 7} x2={cx + 7} y2={y - 7} />
                  </g>,
                );
              });
            }

            if (col.cswap) {
              const { control, a, b } = col.cswap;
              const top = Math.min(control, a, b);
              const bot = Math.max(control, a, b);
              els.push(<line key="csline" x1={cx} y1={yOf(top)} x2={cx} y2={yOf(bot)} stroke="#7dd3fc" strokeWidth={1.6} />);
              els.push(<circle key="csctrl" cx={cx} cy={yOf(control)} r={5} fill="#7dd3fc" />);
              [a, b].forEach((w) => {
                const y = yOf(w);
                els.push(
                  <g key={`cs${w}`} stroke="#7dd3fc" strokeWidth={2}>
                    <line x1={cx - 7} y1={y - 7} x2={cx + 7} y2={y + 7} />
                    <line x1={cx - 7} y1={y + 7} x2={cx + 7} y2={y - 7} />
                  </g>,
                );
              });
            }

            col.boxes?.forEach((b, bi) => {
              const fam = b.family ?? inferFamily(b.label);
              const c = FAMILY_COLOR[fam];
              const y = yOf(b.wire);
              const w = Math.max(boxW, b.label.length * 8.4 + 14);
              els.push(
                <g key={`b${bi}`}>
                  <rect x={cx - w / 2} y={y - boxH / 2} width={w} height={boxH} rx={7} fill={c.fill} stroke={c.stroke} strokeWidth={1.6} />
                  <text x={cx} y={y + 4.5} textAnchor="middle" fill={c.text} className="font-mono" fontSize={12.5}>
                    {b.label}
                  </text>
                </g>,
              );
            });

            col.measure?.forEach((w) => {
              const y = yOf(w);
              const c = FAMILY_COLOR.meas;
              els.push(
                <g key={`m${w}`}>
                  <rect x={cx - boxW / 2} y={y - boxH / 2} width={boxW} height={boxH} rx={7} fill={c.fill} stroke={c.stroke} strokeWidth={1.6} />
                  <path d={`M ${cx - 10} ${y + 6} A 10 10 0 0 1 ${cx + 10} ${y + 6}`} fill="none" stroke={c.text} strokeWidth={1.5} />
                  <line x1={cx} y1={y + 6} x2={cx + 8} y2={y - 6} stroke={c.text} strokeWidth={1.5} />
                </g>,
              );
            });

            return <g key={ci}>{els}</g>;
          })}
        </svg>
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-muted">
          <span className="font-600 text-primary/80">Circuit.</span> {caption}
        </figcaption>
      )}
    </figure>
  );
}
