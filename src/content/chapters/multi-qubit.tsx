import { H2, H3, P, Lead, Callout, PlainEnglish, Takeaways, DataTable, CircuitDiagram, M, Eq } from '../toolkit';

export default function MultiQubit() {
  return (
    <>
      <Lead>
        Single-qubit gates rotate arrows in isolation. To compute anything interesting — to entangle, to build
        logic, to run algorithms — qubits must <em>talk to each other</em>. That conversation happens through
        controlled gates, and it's how a pile of qubits becomes a circuit.
      </Lead>

      <H2>The controlled-NOT (CNOT): quantum's fundamental verb</H2>
      <P>
        The <strong>CNOT</strong> gate acts on two qubits: a <em>control</em> and a <em>target</em>. Its rule
        is a single sentence — <strong>flip the target if and only if the control is</strong>{' '}
        <M>{'|1\\rangle'}</M>. On the four basis states:
      </P>
      <DataTable
        head={['Input', 'Output', 'Flipped?']}
        rows={[
          [<M>{'|00\\rangle'}</M>, <M>{'|00\\rangle'}</M>, 'no (control 0)'],
          [<M>{'|01\\rangle'}</M>, <M>{'|01\\rangle'}</M>, 'no (control 0)'],
          [<M>{'|10\\rangle'}</M>, <M>{'|11\\rangle'}</M>, 'yes'],
          [<M>{'|11\\rangle'}</M>, <M>{'|10\\rangle'}</M>, 'yes'],
        ]}
      />
      <CircuitDiagram
        qubits={['control', 'target']}
        cols={[{ ctrl: { controls: [0], target: 1, kind: 'x' } }]}
        caption="CNOT: the filled dot is the control, the ⊕ is the target. Read it as 'if control is 1, flip target.'"
      />

      <Callout kind="key" title="Why CNOT is the star">
        On classical inputs CNOT is just conditional logic. But feed it a <em>superposed</em> control and it
        does something no classical gate can: it correlates the two qubits into an entangled whole. That is
        precisely the H-then-CNOT recipe that produced the Bell state. CNOT is the gate that manufactures
        entanglement.
      </Callout>

      <H2>The circuit model: reading left to right</H2>
      <P>
        A quantum circuit is a diagram with one horizontal <strong>wire</strong> per qubit and time flowing
        left to right. Gates are boxes and symbols placed on the wires. Everything before the final
        measurement is a single giant unitary; the measurement at the end is the only place randomness enters.
      </P>
      <PlainEnglish>
        A circuit diagram is sheet music for qubits. Each wire is a staff line, each gate is a note, and time
        runs left to right. The measurement at the end is the final chord — the one moment you actually hear
        the result.
      </PlainEnglish>

      <H2>More two-qubit gates</H2>
      <H3>Controlled-Z (CZ)</H3>
      <P>
        Instead of flipping the target, <strong>CZ</strong> applies a phase flip when <em>both</em> qubits are{' '}
        <M>{'|1\\rangle'}</M>. It's perfectly symmetric — there's no “which is the control” — and it shows up
        constantly in Grover's diffusion step and in hardware-native gate sets.
      </P>
      <CircuitDiagram
        qubits={['q0', 'q1']}
        cols={[
          { ctrl: { controls: [0], target: 1, kind: 'z' }, tag: 'CZ' },
          { barrier: true },
          { swap: [0, 1], tag: 'SWAP' },
        ]}
        caption="CZ (two dots, symmetric phase flip) and SWAP (exchanges the two qubits' states)."
      />
      <H3>SWAP</H3>
      <P>
        <strong>SWAP</strong> exchanges the states of two qubits — useful for routing information and, as we'll
        see, for reversing qubit order at the end of the Quantum Fourier Transform. It can be built from three
        CNOTs, a nice exercise in reversible logic.
      </P>

      <H2>Three qubits and beyond: the Toffoli gate</H2>
      <P>
        The <strong>Toffoli</strong> gate (CCNOT) has <em>two</em> controls and flips the target only when both
        are <M>{'|1\\rangle'}</M>. It's a reversible AND gate, and it's enough to build any classical logic
        circuit — proof that quantum computers can do everything classical ones can, reversibly.
      </P>
      <CircuitDiagram
        qubits={['a', 'b', 'target']}
        cols={[{ ctrl: { controls: [0, 1], target: 2, kind: 'x' } }]}
        caption="The Toffoli (CCNOT): target flips only when both controls a and b are |1⟩ — a reversible AND."
      />
      <Callout kind="info" title="Multi-controlled gates in the algorithms">
        Generalized “flip the target if all these controls are 1” gates (written <M>{'\\text{MCX}'}</M>) are
        the beating heart of oracles and diffusion operators. CasimirQ's engine implements <M>{'\\text{mcx}'}</M>{' '}
        and <M>{'\\text{mcz}'}</M> directly, which is why Grover, Shor, and the amplitude-amplification routines
        can express their marking steps cleanly.
      </Callout>

      <H2>Putting it together: a 3-qubit GHZ state</H2>
      <P>
        Chaining CNOTs spreads entanglement across many qubits. Two CNOTs fanning out from one Hadamard produce
        the <strong>GHZ state</strong> <M>{'\\tfrac{1}{\\sqrt2}(|000\\rangle+|111\\rangle)'}</M> — three qubits
        that are “all heads or all tails,” never anything in between.
      </P>
      <CircuitDiagram
        qubits={['q0 |0⟩', 'q1 |0⟩', 'q2 |0⟩']}
        cols={[
          { boxes: [{ wire: 0, label: 'H' }] },
          { ctrl: { controls: [0], target: 1, kind: 'x' } },
          { ctrl: { controls: [1], target: 2, kind: 'x' } },
          { measure: [0, 1, 2] },
        ]}
        caption="The GHZ circuit: entanglement propagates down the register, correlating all three qubits."
      />
      <Eq>{'|\\text{GHZ}\\rangle = \\tfrac{1}{\\sqrt2}\\big(|000\\rangle + |111\\rangle\\big)'}</Eq>

      <Takeaways
        items={[
          <><strong>CNOT</strong> flips a target when its control is <M>{'|1\\rangle'}</M> — and creates entanglement from a superposed control.</>,
          <>A <strong>circuit</strong> is qubit wires read left-to-right; it's one big unitary until the final measurement.</>,
          <><strong>CZ</strong> is a symmetric phase flip; <strong>SWAP</strong> exchanges two qubits (three CNOTs).</>,
          <>The <strong>Toffoli</strong> (CCNOT) is a reversible AND — enough to reproduce all classical logic.</>,
          <>Multi-controlled <M>{'\\text{MCX}/\\text{MCZ}'}</M> gates power the oracles and diffusion steps of Part IV.</>,
        ]}
      />
    </>
  );
}
