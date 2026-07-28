import { H2, H3, P, Lead, Callout, PlainEnglish, Takeaways, Figure, CircuitDiagram, Code, M, Eq } from '../toolkit';

export default function Hhl() {
  return (
    <>
      <Lead>
        Solving <M>{'A\\mathbf{x} = \\mathbf{b}'}</M> — a system of linear equations — is the quiet workhorse of
        science and engineering, buried inside weather models, machine learning, and structural analysis. The
        HHL algorithm can, under the right conditions, solve it <em>exponentially</em> faster than any classical
        method. But the fine print is as important as the headline.
      </Lead>

      <H2>The most useful problem you've never thought about</H2>
      <P>
        Linear systems are everywhere: fit a model, simulate a circuit, balance a chemical reaction, and you're
        solving <M>{'A\\mathbf{x}=\\mathbf{b}'}</M>. Classically, for an <M>{'N\\times N'}</M> system this costs
        roughly <M>{'O(N)'}</M> to <M>{'O(N^3)'}</M> depending on structure. In 2009, Harrow, Hassidim, and Lloyd
        found a quantum algorithm running in <M>{'O(\\log N)'}</M> under the right conditions — an exponential
        leap in the dimension.
      </P>

      <H2>The idea: invert the eigenvalues</H2>
      <P>
        Any well-behaved matrix has eigenvectors <M>{'|u_j\\rangle'}</M> with eigenvalues <M>{'\\lambda_j'}</M>.
        Solving the system is really just dividing by those eigenvalues. Write <M>{'\\mathbf{b}'}</M> in the
        eigenbasis and the solution is:
      </P>
      <Eq>{'|\\mathbf{b}\\rangle = \\sum_j \\beta_j |u_j\\rangle \\;\\Longrightarrow\\; |\\mathbf{x}\\rangle = A^{-1}|\\mathbf{b}\\rangle = \\sum_j \\frac{\\beta_j}{\\lambda_j}|u_j\\rangle'}</Eq>
      <P>HHL performs exactly that division, in three moves you already know:</P>
      <P>
        <strong>1. Phase estimation</strong> (Chapter 12) writes each eigenvalue <M>{'\\lambda_j'}</M> into a
        clock register. <strong>2. A controlled rotation</strong> rotates an ancilla by an angle{' '}
        <M>{'\\propto 1/\\lambda_j'}</M> — this is the “divide by <M>{'\\lambda'}</M>” step.{' '}
        <strong>3. Inverse phase estimation</strong> uncomputes the clock, leaving the solution amplitudes.
      </P>
      <CircuitDiagram
        qubits={['ancilla', 'clock₀', 'clock₁', 'b']}
        cols={[
          { boxes: [{ wire: 3, label: '|b⟩', family: 'oracle' }], tag: 'load' },
          { boxes: [{ wire: 1, label: 'QPE', family: 'rot' }, { wire: 2, label: 'QPE', family: 'rot' }], tag: 'eigenvalues' },
          { ctrl: { controls: [1, 2], target: 0, kind: 'box', label: 'Ry(1/λ)', family: 'rot' }, tag: 'invert' },
          { boxes: [{ wire: 1, label: 'QPE†', family: 'rot' }, { wire: 2, label: 'QPE†', family: 'rot' }], tag: 'uncompute' },
          { measure: [0] },
        ]}
        caption="HHL: estimate eigenvalues into a clock, rotate an ancilla by 1/λ, uncompute. Post-select on the ancilla being |1⟩."
      />

      <PlainEnglish>
        Think of <M>{'\\mathbf{b}'}</M> as a chord and the matrix's eigenvalues as the pitches of its notes.
        Phase estimation is a tuner that identifies each pitch. HHL then turns up the quiet notes and turns down
        the loud ones — dividing by pitch — and plays the chord back. That rebalanced chord is the solution
        <M>{'\\mathbf{x}'}</M>.
      </PlainEnglish>

      <H2>Read the fine print</H2>
      <P>
        HHL is a favorite cautionary tale about quantum hype, because its exponential speedup comes wrapped in
        conditions that are easy to overlook:
      </P>
      <Callout kind="warn" title="What HHL does — and doesn't — give you">
        <strong>It doesn't output <M>{'\\mathbf{x}'}</M>.</strong> It produces a quantum <em>state</em>{' '}
        <M>{'|\\mathbf{x}\\rangle'}</M>. Reading all <M>{'N'}</M> entries would erase the speedup — you can only
        extract summary quantities like <M>{'\\langle\\mathbf{x}|M|\\mathbf{x}\\rangle'}</M>.{' '}
        <strong>It needs a well-conditioned matrix</strong> (small condition number <M>{'\\kappa'}</M>).{' '}
        <strong>It needs efficient loading</strong> of <M>{'\\mathbf{b}'}</M> and an efficiently-simulable{' '}
        <M>{'A'}</M>. Miss any of these and the advantage evaporates.
      </Callout>

      <H2>HHL in CasimirQ</H2>
      <P>
        CasimirQ implements HHL on a canonical, well-conditioned <M>{'2\\times2'}</M> system{' '}
        <M>{'A = 1.5\\,I + 0.5\\,X'}</M>, so you can watch the full pipeline — load, QPE, reciprocal rotation,
        inverse QPE, ancilla post-selection — and compare the quantum solution against the exact classical one.
        Here's a real run, reporting fidelity 1.0 against the classical answer:
      </P>
      <Figure
        src="/screenshots/algorithm-modal.png"
        alt="The CasimirQ algorithm runner modal, used here to configure and launch an algorithm run."
        caption="Launching an algorithm from CasimirQ. HHL reports its quantum solution vector, the classical reference, fidelity, and the post-selection success probability."
      />
      <Code
        lang="rust"
        title="hhl via casq-sdk"
        code={`// Solve the canonical 2x2 system A x = b with A = 1.5 I + 0.5 X.
let hhl = client.algorithms().hhl(/* b */ &[1.0, 0.0]).await?;

println!("classical solution = {:?}", hhl.classical_solution); // [0.9487, -0.3162]
println!("quantum solution   = {:?}", hhl.quantum_solution);
println!("fidelity           = {:.4}", hhl.fidelity);           // 1.0000
println!("success probability = {:.4}", hhl.success_probability);`}
      />

      <H3>The honest verdict</H3>
      <P>
        HHL is genuinely important — it introduced the “eigenvalue inversion” pattern reused across quantum
        machine learning and optimization. But it's the poster child for a broader lesson: a quantum{' '}
        <em>speedup on paper</em> is not the same as a quantum <em>advantage in practice</em>. Always ask how
        the data gets in, and how the answer gets out.
      </P>

      <Takeaways
        items={[
          <><strong>HHL</strong> solves <M>{'A\\mathbf x=\\mathbf b'}</M> in <M>{'O(\\log N)'}</M> under the right conditions.</>,
          <>It works by <strong>estimating eigenvalues</strong> (QPE) and rotating an ancilla by <M>{'1/\\lambda'}</M>.</>,
          <>It outputs a <strong>quantum state</strong> <M>{'|\\mathbf x\\rangle'}</M>, not the raw vector — you read summaries, not all entries.</>,
          <>The speedup needs a <strong>well-conditioned matrix</strong> and efficient data loading — read the fine print.</>,
          <>CasimirQ runs a canonical 2×2 case end-to-end with <strong>fidelity 1.0</strong> vs the classical solution.</>,
        ]}
      />
    </>
  );
}
