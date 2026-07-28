import { H2, H3, P, Lead, Callout, PlainEnglish, Takeaways, CircuitDiagram, Code, M, Eq } from '../toolkit';

export default function QftQpe() {
  return (
    <>
      <Lead>
        If interference is the engine of quantum computing, the Quantum Fourier Transform is its transmission —
        the gearbox that converts phases into readable numbers. Master the QFT and its flagship application,
        phase estimation, and you hold the key to Shor's algorithm, HHL, and half of Part IV.
      </Lead>

      <H2>Fourier, in one paragraph</H2>
      <P>
        The Fourier transform answers a single question: <em>what frequencies is this signal made of?</em> Feed
        it a wobble and it tells you the pure tones hidden inside. The <strong>Quantum</strong> Fourier
        Transform does the same to a quantum state — but it acts on all <M>{'2^n'}</M> amplitudes at once, in
        only <M>{'O(n^2)'}</M> gates, versus <M>{'O(n 2^n)'}</M> for the classical FFT.
      </P>
      <Eq label="QFT">{'\\text{QFT}\\,|x\\rangle = \\tfrac{1}{\\sqrt{N}}\\sum_{k=0}^{N-1} e^{2\\pi i\\,xk/N}\\,|k\\rangle,\\qquad N=2^n'}</Eq>
      <PlainEnglish>
        The QFT is a translator between two languages. In the “computational” language, information sits in{' '}
        <em>which basis state</em> has amplitude. In the “Fourier” language, information sits in the{' '}
        <em>phases</em> — the rate at which amplitudes rotate as you scan across states. Many quantum tricks
        hide the answer as a frequency; the QFT is how you read it.
      </PlainEnglish>

      <H3>The circuit: Hadamards and controlled phases</H3>
      <P>
        The QFT has a strikingly regular structure. Each qubit gets a Hadamard, followed by controlled-phase
        gates <M>{'P(\\pi/2^k)'}</M> from every less-significant qubit — smaller and smaller phase kicks. A
        final round of SWAPs reverses the qubit order.
      </P>
      <CircuitDiagram
        qubits={['q0', 'q1', 'q2']}
        cols={[
          { boxes: [{ wire: 0, label: 'H' }] },
          { ctrl: { controls: [1], target: 0, kind: 'box', label: 'S', family: 'phase' } },
          { ctrl: { controls: [2], target: 0, kind: 'box', label: 'T', family: 'phase' } },
          { boxes: [{ wire: 1, label: 'H' }] },
          { ctrl: { controls: [2], target: 1, kind: 'box', label: 'S', family: 'phase' } },
          { boxes: [{ wire: 2, label: 'H' }] },
          { swap: [0, 2] },
        ]}
        caption="The 3-qubit QFT: a Hadamard per qubit, a cascade of controlled phase rotations, then a SWAP to fix the ordering."
      />
      <Callout kind="info" title="Endianness matters">
        Which qubit is the least-significant bit is a real decision, not a detail. CasimirQ's implementation
        fixes qubit 0 as the LSB, and the closing SWAPs exist precisely to reconcile the QFT's natural
        bit-reversed output with that convention. Get this wrong and your phases come out mirrored.
      </Callout>

      <H2>Quantum Phase Estimation: reading an eigenphase</H2>
      <P>
        The QFT rarely appears alone. Its killer application is <strong>Quantum Phase Estimation (QPE)</strong>,
        which answers: given a unitary <M>{'U'}</M> and one of its eigenstates <M>{'|\\psi\\rangle'}</M> with{' '}
        <M>{'U|\\psi\\rangle = e^{2\\pi i\\varphi}|\\psi\\rangle'}</M>, <em>what is the phase</em>{' '}
        <M>{'\\varphi'}</M>? QPE reads it out to as many bits as you have counting qubits.
      </P>
      <P>The recipe has three movements:</P>
      <P>
        <strong>1. Superpose</strong> a register of <M>{'t'}</M> counting qubits with Hadamards.{' '}
        <strong>2. Kick back</strong> the phase: apply <M>{'U^{2^j}'}</M> controlled on counting qubit{' '}
        <M>{'j'}</M>, so each qubit accumulates a different multiple of <M>{'\\varphi'}</M>.{' '}
        <strong>3. Inverse-QFT</strong> the counting register and measure — out comes a binary approximation of{' '}
        <M>{'\\varphi'}</M>.
      </P>
      <CircuitDiagram
        qubits={['c0 |0⟩', 'c1 |0⟩', 'c2 |0⟩', 'ψ']}
        cols={[
          { boxes: [{ wire: 0, label: 'H' }, { wire: 1, label: 'H' }, { wire: 2, label: 'H' }], tag: 'superpose' },
          { ctrl: { controls: [0], target: 3, kind: 'box', label: 'U', family: 'phase' }, tag: 'U¹' },
          { ctrl: { controls: [1], target: 3, kind: 'box', label: 'U²', family: 'phase' } },
          { ctrl: { controls: [2], target: 3, kind: 'box', label: 'U⁴', family: 'phase' } },
          { boxes: [{ wire: 0, label: 'QFT†', family: 'rot' }, { wire: 1, label: 'QFT†', family: 'rot' }, { wire: 2, label: 'QFT†', family: 'rot' }], tag: 'read' },
          { measure: [0, 1, 2] },
        ]}
        caption="Phase estimation: controlled powers of U imprint the eigenphase across the counting register; the inverse QFT decodes it into bits."
      />

      <Callout kind="key" title="Why QPE is everywhere">
        A huge range of questions can be recast as “find the eigenphase of some unitary.” The <em>period</em> of
        modular exponentiation (Shor). The <em>eigenvalues</em> of a matrix (HHL). The <em>energy</em> of a
        molecule (quantum chemistry). QPE is the universal adapter that turns those questions into a number you
        can measure.
      </Callout>

      <H3>Running QPE in CasimirQ</H3>
      <P>
        CasimirQ's phase-estimation algorithm takes a target phase <M>{'\\varphi'}</M>, builds{' '}
        <M>{'U = P(2\\pi\\varphi)'}</M> whose eigenstate is <M>{'|1\\rangle'}</M>, and estimates{' '}
        <M>{'\\varphi'}</M> back to <M>{'t'}</M> bits of precision. It's the perfect sandbox for watching
        precision improve as you add counting qubits.
      </P>
      <Code
        lang="rust"
        title="phase estimation via casq-sdk"
        code={`// Estimate phi = 0.375 using 4 counting qubits.
let qpe = client.algorithms().phase_estimation(0.375, 4).await?;

println!("true phi      = 0.375");
println!("estimated phi = {:.4}", qpe.estimated_phase);
println!("counting bits = {}", qpe.counting_qubits);
// With 4 bits, 0.375 = 0.0110₂ is captured exactly.`}
      />

      <Takeaways
        items={[
          <>The <strong>QFT</strong> moves information between the computational and phase (frequency) bases in <M>{'O(n^2)'}</M> gates.</>,
          <>Its circuit is Hadamards + a cascade of <strong>controlled phase rotations</strong> + closing SWAPs (mind the endianness).</>,
          <><strong>Phase estimation</strong> reads the eigenphase of a unitary via controlled powers + an inverse QFT.</>,
          <>QPE is the shared engine of <strong>Shor, HHL, and quantum chemistry</strong> — arguably the most important subroutine in Part IV.</>,
        ]}
      />
    </>
  );
}
