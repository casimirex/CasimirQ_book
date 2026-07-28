import { H2, P, Lead, Callout, Takeaways } from '../toolkit';
import { CircuitDiagram } from '@/components/CircuitDiagram';
import { CATEGORIES, CIRCUITS, CONCEPTUAL, opsToCols, type BasicCircuit } from '../basicCircuits';

function CircuitEntry({ c }: { c: BasicCircuit }) {
  return (
    <div className="my-4 rounded-xl border border-border bg-surface/40 p-4">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-[15px] font-600 text-ink">{c.name}</h3>
        <span className="shrink-0 rounded-md bg-white/5 px-2 py-0.5 font-mono text-[11px] text-muted">
          {c.n}q · {c.ops.length}g
        </span>
      </div>
      <p className="mt-1 text-sm text-muted">{c.desc}</p>
      <CircuitDiagram qubits={Array.from({ length: c.n }, (_, i) => `q${i}`)} cols={opsToCols(c.ops)} className="!my-3" />
    </div>
  );
}

export default function CircuitLibrary() {
  return (
    <>
      <Lead>
        Every quantum algorithm — Deutsch-Jozsa, Grover, Shor, VQE — is a clever arrangement of a small set
        of building blocks. This chapter is the reference shelf: <strong>53 basic circuits</strong>, drawn on
        their wires and grouped by category, each one a real, verified circuit you can open in CasimirQ's
        Circuit Library and run.
      </Lead>

      <Callout kind="info" title="Live on the platform">
        These are the exact circuits seeded into CasimirQ's <strong>Circuit Library</strong> (its own sidebar
        section). Every one was verified by simulating it on the engine; here we additionally <em>draw</em> each
        so you can see the gates on the wires. Colour and shape match the builder: teal H, blue Pauli, violet
        phase, amber rotations, and the amber control-dot-plus-⊕ for CNOTs.
      </Callout>

      {CATEGORIES.map((cat) => {
        const items = CIRCUITS.filter((c) => c.cat === cat.id);
        if (items.length === 0) return null;
        return (
          <section key={cat.id}>
            <H2>{`${cat.id}. ${cat.label}`}</H2>
            <P>
              <span className="text-muted">{cat.blurb}</span> — {items.length} circuits.
            </P>
            {items.map((c) => (
              <CircuitEntry key={c.key} c={c} />
            ))}
          </section>
        );
      })}

      <H2>Conceptual entries</H2>
      <P>
        The full catalogue lists 91 entries. The rest are not concrete circuits on this engine — they are
        hardware-native gates, large arithmetic, fault-tolerance machinery, or entire gate <em>sets</em>. We
        name them honestly rather than fake a diagram:
      </P>
      <div className="my-5 rounded-xl border border-border bg-surface/40 p-5">
        <ul className="space-y-2">
          {CONCEPTUAL.map((c) => (
            <li key={c.name} className="text-sm">
              <span className="font-600 text-ink">{c.name}</span>
              <span className="text-muted"> — {c.why}</span>
            </li>
          ))}
        </ul>
      </div>

      <Takeaways
        items={[
          <>The catalogue's <strong>53 buildable circuits</strong> span single/two/three-qubit gates, state preparation, measurement, and reusable subroutines.</>,
          <>Each is a <strong>real, verified</strong> saved circuit in CasimirQ's Circuit Library — open any in the builder and run it.</>,
          <>Bigger algorithms are just these blocks composed: an <strong>oracle</strong> + <strong>diffusion</strong> is Grover; <strong>QFT</strong> + controlled powers is phase estimation.</>,
          <>Entries the engine can't express (iSWAP, QRAM, gate-sets, …) are flagged as <strong>conceptual</strong>, never faked.</>,
        ]}
      />
    </>
  );
}
