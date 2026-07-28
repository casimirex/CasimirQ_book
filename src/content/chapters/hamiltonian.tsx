import { H2, H3, P, Lead, Callout, PlainEnglish, Takeaways, CircuitDiagram, Code, M, Eq } from '../toolkit';

export default function Hamiltonian() {
  return (
    <>
      <Lead>
        Richard Feynman's original 1982 pitch for quantum computers wasn't factoring or search — it was this:
        “Nature isn't classical, so if you want to simulate nature, you'd better make it quantum mechanical.”
        Hamiltonian simulation is that founding application. It's how a quantum computer models molecules,
        materials, and the fundamental dynamics of physics.
      </Lead>

      <H2>The Hamiltonian: nature's rulebook</H2>
      <P>
        In quantum mechanics, a system's total energy is described by an operator called the{' '}
        <strong>Hamiltonian</strong> <M>{'H'}</M>. It does more than bookkeep energy — it{' '}
        <em>generates time evolution</em>. The Schrödinger equation says a state evolves by:
      </P>
      <Eq label="time evolution">{'|\\psi(t)\\rangle = e^{-iHt}\\,|\\psi(0)\\rangle'}</Eq>
      <P>
        So “simulating a physical system” means applying the unitary <M>{'e^{-iHt}'}</M>. If you can build that
        operator as a circuit, you can fast-forward chemistry: watch electrons rearrange, bonds form, spins
        align. The trouble is that <M>{'H'}</M> for a real molecule is an enormous matrix — exactly the object
        classical computers choke on.
      </P>

      <H2>The trick: Trotterization</H2>
      <P>
        Real Hamiltonians are sums of simpler pieces — local interactions between a few particles at a time:{' '}
        <M>{'H = H_1 + H_2 + \\cdots + H_m'}</M>. Each piece is easy to exponentiate on its own. If only we
        could do them one at a time. We nearly can — the catch is that quantum operators don't generally
        commute, so <M>{'e^{-iHt} \\neq e^{-iH_1 t}e^{-iH_2 t}\\cdots'}</M> exactly.
      </P>
      <P>
        The <strong>Trotter-Suzuki</strong> formula rescues us: for a <em>small</em> time slice{' '}
        <M>{'\\Delta t'}</M>, the pieces almost commute, and the error shrinks with the slice size. Chop the
        evolution into many small steps and apply the pieces in sequence each step:
      </P>
      <Eq>{'e^{-iHt} \\approx \\Big(e^{-iH_1 \\Delta t}\\,e^{-iH_2 \\Delta t}\\cdots e^{-iH_m \\Delta t}\\Big)^{t/\\Delta t}'}</Eq>
      <PlainEnglish>
        You can't stir milk and sugar into coffee simultaneously, but if you add a pinch of each, stir, add
        another pinch, stir, and repeat, the cup ends up the same as if you'd done it all at once. Trotterization
        is that alternating pinch-and-stir: many tiny, easy steps approximate one impossible-looking leap.
      </PlainEnglish>

      <H3>Exponentiating a Pauli term</H3>
      <P>
        Each local piece is a <strong>Pauli string</strong> like <M>{'Z_0 Z_1'}</M> or <M>{'X_0 Y_1'}</M>, and{' '}
        <M>{'e^{-i\\theta P}'}</M> has a standard circuit: rotate into the right basis (a Hadamard for each{' '}
        <M>{'X'}</M>, an <M>{'R_x(\\tfrac\\pi2)'}</M> for each <M>{'Y'}</M>), entangle with a CNOT ladder, apply
        a single <M>{'R_z(2\\theta)'}</M>, then uncompute.
      </P>
      <CircuitDiagram
        qubits={['q0', 'q1']}
        cols={[
          { boxes: [{ wire: 0, label: 'H' }, { wire: 1, label: 'H' }], tag: 'basis' },
          { ctrl: { controls: [0], target: 1, kind: 'x' }, tag: 'ladder' },
          { boxes: [{ wire: 1, label: 'Rz(2θ)', family: 'rot' }], tag: 'phase' },
          { ctrl: { controls: [0], target: 1, kind: 'x' }, tag: 'undo' },
          { boxes: [{ wire: 0, label: 'H' }, { wire: 1, label: 'H' }], tag: 'basis' },
        ]}
        caption="The e^{-iθ X₀X₁} gadget: change basis, CNOT ladder, a single Rz rotation carrying the angle, then uncompute."
      />

      <H2>The accuracy dial</H2>
      <P>
        More Trotter steps means a better approximation but a deeper (noisier, slower) circuit. Higher-order
        Trotter formulas buy accuracy at the cost of more gates per step. CasimirQ's{' '}
        <strong>Hamiltonian Simulation</strong> algorithm exposes both knobs — the number of steps and the
        Trotter order — and verifies the result against an exact reference for small systems, so you can watch
        the approximation converge.
      </P>
      <Callout kind="key" title="The application that may matter most">
        Search and factoring are dramatic, but simulating quantum systems is the application many experts expect
        to pay off <em>first</em>. Designing catalysts, batteries, superconductors, and drugs all hinge on
        quantum chemistry that classical computers can only approximate. A modest, noisy quantum computer running
        Hamiltonian simulation could change materials science before it ever breaks a cipher.
      </Callout>

      <Code
        lang="rust"
        title="hamiltonian simulation via casq-sdk"
        code={`use casq_sdk::PauliTerm;

// A simple transverse-field Ising slice: Z0Z1 coupling + X fields.
let terms = vec![
    PauliTerm { coefficient: 1.0, paulis: "ZZ".into(), qubits: vec![0, 1] },
    PauliTerm { coefficient: 0.5, paulis: "X".into(),  qubits: vec![0] },
    PauliTerm { coefficient: 0.5, paulis: "X".into(),  qubits: vec![1] },
];

let sim = client
    .algorithms()
    .hamiltonian_simulation(2, &terms, /* time */ 1.0, /* steps */ 8, /* order */ 2)
    .await?;

println!("fidelity vs exact = {:.4}", sim.fidelity);`}
      />

      <Takeaways
        items={[
          <>The <strong>Hamiltonian</strong> generates time evolution <M>{'e^{-iHt}'}</M> — simulating physics means building that unitary.</>,
          <><strong>Trotterization</strong> splits <M>{'H'}</M> into local pieces applied in many small steps, since operators don't commute.</>,
          <>Each <strong>Pauli term</strong> exponential is a basis-change + CNOT-ladder + single <M>{'R_z'}</M> gadget.</>,
          <>Steps and Trotter order trade <strong>accuracy against depth</strong>; CasimirQ verifies against an exact reference.</>,
          <>Quantum <strong>simulation of nature</strong> — Feynman's original vision — may be the first killer app.</>,
        ]}
      />
    </>
  );
}
