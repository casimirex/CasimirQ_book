import { H2, P, Lead, Callout, PlainEnglish, Takeaways, CircuitDiagram, Code, DataTable, M, Eq } from '../toolkit';

export default function Variational() {
  return (
    <>
      <Lead>
        Every algorithm so far assumed a flawless, deep quantum computer — the kind we don't have yet.
        Variational algorithms are the pragmatic response: short quantum circuits steered by a classical
        optimizer, designed to squeeze useful answers out of today's noisy machines. VQE and QAOA are the two
        flagships, and they're where quantum computing shakes hands with machine learning.
      </Lead>

      <H2>The hybrid loop</H2>
      <P>
        A variational algorithm is a partnership. The quantum computer runs a short parameterized circuit — an{' '}
        <strong>ansatz</strong> <M>{'|\\psi(\\vec\\theta)\\rangle'}</M> full of tunable rotation angles — and
        measures an average value. A classical optimizer reads that number and adjusts the angles to improve it.
        Around and around until it converges.
      </P>
      <DataTable
        head={['Who', 'Does', 'Because']}
        rows={[
          ['Quantum computer', <>prepares <M>{'|\\psi(\\vec\\theta)\\rangle'}</M>, measures an energy</>, 'it can hold states classical machines can’t'],
          ['Classical optimizer', <>updates <M>{'\\vec\\theta'}</M> to lower the energy</>, 'gradient descent is cheap and robust to noise'],
        ]}
      />
      <PlainEnglish>
        It's a game of “warmer, colder.” The quantum circuit makes a guess and reports how good it is; the
        classical optimizer says “warmer — nudge that dial” and the circuit tries again. Neither could win
        alone, but together they home in on the answer — and the short circuits survive the noise.
      </PlainEnglish>

      <H2>VQE: finding the ground state</H2>
      <P>
        The <strong>Variational Quantum Eigensolver</strong> finds the lowest energy — the{' '}
        <strong>ground state</strong> — of a Hamiltonian. This is the central question of quantum chemistry: the
        ground-state energy of a molecule tells you its stability, its bonds, its reactivity. VQE rests on a
        rock-solid principle:
      </P>
      <Eq label="variational principle">{'E(\\vec\\theta) = \\langle\\psi(\\vec\\theta)|H|\\psi(\\vec\\theta)\\rangle \\;\\geq\\; E_0'}</Eq>
      <P>
        The measured energy of <em>any</em> trial state is always at least the true ground-state energy{' '}
        <M>{'E_0'}</M>. So you can't overshoot — you can only push the energy down toward the truth. Minimize{' '}
        <M>{'E(\\vec\\theta)'}</M> over the angles and you approximate <M>{'E_0'}</M> from above.
      </P>
      <CircuitDiagram
        qubits={['q0 |0⟩', 'q1 |0⟩']}
        cols={[
          { boxes: [{ wire: 0, label: 'Ry(θ₀)', family: 'rot' }, { wire: 1, label: 'Ry(θ₁)', family: 'rot' }], tag: 'ansatz' },
          { ctrl: { controls: [0], target: 1, kind: 'x' }, tag: 'entangle' },
          { boxes: [{ wire: 0, label: 'Ry(θ₂)', family: 'rot' }, { wire: 1, label: 'Ry(θ₃)', family: 'rot' }] },
          { measure: [0, 1] },
        ]}
        caption="A hardware-efficient VQE ansatz: layers of tunable Ry rotations and entangling CNOTs. The optimizer searches the angles θ."
      />

      <H2>QAOA: optimization by quantum annealing's cousin</H2>
      <P>
        The <strong>Quantum Approximate Optimization Algorithm</strong> attacks combinatorial problems — the
        classic being <strong>MaxCut</strong>: split a graph's nodes into two groups so as to cut the most
        edges. QAOA alternates two operators for <M>{'p'}</M> rounds: a <em>cost</em> layer that phases in the
        problem, and a <em>mixer</em> layer that explores. The angles of each layer are the variational
        parameters.
      </P>
      <Eq>{'|\\vec\\gamma,\\vec\\beta\\rangle = \\prod_{k=1}^{p} e^{-i\\beta_k H_M}\\,e^{-i\\gamma_k H_C}\\,H^{\\otimes n}|0\\rangle'}</Eq>
      <P>
        Deeper circuits (larger <M>{'p'}</M>) give better approximations. QAOA is a leading candidate for
        near-term advantage precisely because you can dial <M>{'p'}</M> down to whatever your noisy hardware can
        handle and still get a useful answer.
      </P>

      <Callout kind="key" title="This is quantum machine learning">
        The variational recipe — a parameterized quantum circuit trained by a classical optimizer to minimize a
        loss — <em>is</em> the template of quantum machine learning. Swap “energy” for “classification loss” and
        the ansatz becomes a quantum neural network. VQE and QAOA are the gateway to the entire QML field, which
        is why they anchor the “optimization” category in CasimirQ.
      </Callout>

      <H2>Running them in CasimirQ</H2>
      <P>
        CasimirQ seeds both from built-in examples so you can run them immediately: VQE ships with example
        Hamiltonians (including a hydrogen molecule, <M>{'H_2'}</M>), and QAOA ships with example graphs (a
        triangle, and more). Pick an example, run, and watch the optimizer converge to the ground-state energy
        or the best cut.
      </P>
      <Code
        lang="rust"
        title="VQE and QAOA via casq-sdk"
        code={`let algos = client.algorithms();

// VQE on the built-in H2 molecule Hamiltonian.
let h2 = algos.vqe_examples().await?;
if let Some(hamiltonian) = h2.get("H2") {
    let n = /* qubits the Hamiltonian acts on */ 2;
    let vqe = algos.vqe(n, hamiltonian, Some(100)).await?;
    println!("ground-state energy = {:.4}  (converged: {})",
        vqe.optimal_energy, vqe.converged);
}

// QAOA MaxCut on the built-in triangle graph.
let graphs = algos.qaoa_examples().await?;
if let Some(tri) = graphs.get("triangle") {
    let qaoa = algos.qaoa(tri.n, &tri.edges, Some(1)).await?;
    println!("best cut = {}  (expectation {:.4})",
        qaoa.best_cut_value, qaoa.max_expectation);
}`}
      />

      <Takeaways
        items={[
          <><strong>Variational</strong> algorithms pair a short quantum ansatz with a classical optimizer — built for noisy, near-term hardware.</>,
          <><strong>VQE</strong> minimizes <M>{'\\langle\\psi(\\vec\\theta)|H|\\psi(\\vec\\theta)\\rangle \\geq E_0'}</M> to find ground-state energies (quantum chemistry).</>,
          <><strong>QAOA</strong> alternates cost and mixer layers for <M>{'p'}</M> rounds to approximate combinatorial optima like MaxCut.</>,
          <>The parameterized-circuit-plus-optimizer template <strong>is quantum machine learning</strong>.</>,
          <>CasimirQ seeds VQE with example Hamiltonians (incl. <M>{'H_2'}</M>) and QAOA with example graphs.</>,
        ]}
      />
    </>
  );
}
