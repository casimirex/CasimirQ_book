import { H2, H3, P, Lead, Callout, PlainEnglish, Takeaways, CircuitDiagram, DataTable, M, Eq } from '../toolkit';

export default function Entanglement() {
  return (
    <>
      <Lead>
        Two qubits can be woven together so tightly that neither has a state of its own — only the pair does.
        Measure one and the other responds instantly, though no signal passes between them. This is
        entanglement: the phenomenon Einstein distrusted, Bell made testable, and quantum computers use as
        everyday plumbing.
      </Lead>

      <H2>Independent qubits: the product state</H2>
      <P>
        Start with two qubits that mind their own business. If the first is <M>{'|+\\rangle'}</M> and the
        second is <M>{'|0\\rangle'}</M>, the joint state is just their combination (a <em>tensor product</em>):
      </P>
      <Eq>{'|+\\rangle \\otimes |0\\rangle = \\tfrac{1}{\\sqrt2}\\big(|00\\rangle + |10\\rangle\\big)'}</Eq>
      <P>
        The defining feature of such a <strong>product state</strong> is that you can describe each qubit
        separately. Measuring the second qubit tells you nothing new about the first. Most two-qubit states,
        though, are not like this — and that's where things get interesting.
      </P>

      <H2>Building a Bell state</H2>
      <P>
        The most famous entangled state takes just two gates: a Hadamard to make a superposition, then a{' '}
        <strong>CNOT</strong> (controlled-NOT) to link the qubits. The CNOT flips the second qubit only when
        the first is <M>{'|1\\rangle'}</M>.
      </P>

      <CircuitDiagram
        qubits={['q0 |0⟩', 'q1 |0⟩']}
        cols={[
          { boxes: [{ wire: 0, label: 'H' }], tag: 'superpose' },
          { ctrl: { controls: [0], target: 1, kind: 'x' }, tag: 'entangle' },
          { measure: [0, 1] },
        ]}
        caption="The Bell-state circuit — the 'hello world' of entanglement. You'll build this exact circuit in CasimirQ two chapters from now."
      />

      <P>Follow the amplitudes. After the Hadamard on <M>{'q_0'}</M>:</P>
      <Eq>{'\\tfrac{1}{\\sqrt2}(|0\\rangle+|1\\rangle)\\otimes|0\\rangle = \\tfrac{1}{\\sqrt2}(|00\\rangle + |10\\rangle)'}</Eq>
      <P>Now the CNOT flips <M>{'q_1'}</M> in the <M>{'|10\\rangle'}</M> branch, turning it into <M>{'|11\\rangle'}</M>:</P>
      <Eq label="Bell state Φ⁺">{'|\\Phi^+\\rangle = \\tfrac{1}{\\sqrt2}\\big(|00\\rangle + |11\\rangle\\big)'}</Eq>

      <Callout kind="key" title="Why this state is special">
        Try to write <M>{'|\\Phi^+\\rangle'}</M> as <M>{'(a|0\\rangle+b|1\\rangle)\\otimes(c|0\\rangle+d|1\\rangle)'}</M>.
        You can't — no choice of <M>{'a,b,c,d'}</M> works, because that product always contains a{' '}
        <M>{'|01\\rangle'}</M> or <M>{'|10\\rangle'}</M> term, which <M>{'|\\Phi^+\\rangle'}</M> lacks. The
        state simply <strong>cannot be factored</strong> into two independent qubits. That is the mathematical
        signature of entanglement.
      </Callout>

      <H2>The spooky part: correlated measurements</H2>
      <P>
        Measure the two qubits of <M>{'|\\Phi^+\\rangle'}</M>. The possible outcomes are only{' '}
        <M>{'00'}</M> and <M>{'11'}</M>, each with probability <M>{'\\tfrac12'}</M>. You will{' '}
        <strong>never</strong> see <M>{'01'}</M> or <M>{'10'}</M>. Each qubit alone looks like a fair coin — 50%
        zero, 50% one — but the two coins always agree.
      </P>
      <DataTable
        head={['Outcome', 'Probability', 'Seen?']}
        rows={[
          [<M>{'00'}</M>, <M>{'1/2'}</M>, '✅ yes'],
          [<M>{'11'}</M>, <M>{'1/2'}</M>, '✅ yes'],
          [<M>{'01'}</M>, <M>{'0'}</M>, '🚫 never'],
          [<M>{'10'}</M>, <M>{'0'}</M>, '🚫 never'],
        ]}
      />
      <P>
        Here is the vertigo: separate the qubits by a room, a city, a galaxy. Measure <M>{'q_0'}</M> and get{' '}
        <M>{'1'}</M>; you now know with certainty that <M>{'q_1'}</M> will read <M>{'1'}</M> too, the instant
        it is measured. The correlation is perfect and immediate.
      </P>

      <Callout kind="warn" title="No, you can't send messages faster than light">
        Before you plan an interstellar telegraph: the person holding <M>{'q_0'}</M> sees only random coin
        flips. They can't <em>choose</em> the outcome, so they can't encode a message. The correlation is only
        visible <em>after</em> both parties compare notes over an ordinary (light-speed-limited) channel.
        Entanglement creates correlation, not communication. Relativity survives.
      </Callout>

      <PlainEnglish>
        Imagine a pair of magic gloves split into two boxes and shipped across the world. Neither box “contains”
        a left or right glove until opened — yet the moment you open yours and find the left glove, you know the
        distant box holds the right one. The strange quantum twist: unlike gloves, it was genuinely undecided
        until you looked, and you can prove it.
      </PlainEnglish>

      <H3>Bell's theorem, in one breath</H3>
      <P>
        A skeptic (Einstein among them) might say the answer was secretly fixed at the start — the gloves were
        just pre-sorted. In 1964 John Bell found a way to test this. He showed that any “secretly pre-sorted”
        theory must obey an inequality that entangled quantum states <em>violate</em>. Decades of experiments
        agree with quantum mechanics. The conclusion is genuinely startling: the correlations are real, and
        they are not explained by hidden pre-arranged values.
      </P>

      <H2>Why computers care</H2>
      <P>
        Entanglement is not a party trick; it is essential infrastructure:
      </P>
      <P>
        It lets <M>{'n'}</M> qubits explore correlations that classical bits can't represent compactly —
        the source of quantum computing's expressive power. It is the resource consumed by{' '}
        <strong>quantum teleportation</strong> (Chapter 19) to move a state across a link. It underlies{' '}
        <strong>superdense coding</strong>, error-correcting codes, and the multi-qubit interference patterns
        inside Shor's and Grover's algorithms. Whenever a quantum algorithm outperforms its classical rival,
        entanglement is somewhere in the machinery.
      </P>

      <Callout kind="info" title="The four Bell states">
        <M>{'|\\Phi^+\\rangle'}</M> has three cousins, obtained by flipping signs and bits:{' '}
        <M>{'|\\Phi^-\\rangle=\\tfrac{1}{\\sqrt2}(|00\\rangle-|11\\rangle)'}</M>,{' '}
        <M>{'|\\Psi^+\\rangle=\\tfrac{1}{\\sqrt2}(|01\\rangle+|10\\rangle)'}</M>, and{' '}
        <M>{'|\\Psi^-\\rangle=\\tfrac{1}{\\sqrt2}(|01\\rangle-|10\\rangle)'}</M>. Together these four maximally
        entangled states form a basis for two qubits and appear all over quantum protocols.
      </Callout>

      <Takeaways
        items={[
          <>A <strong>product state</strong> factors into independent qubits; an <strong>entangled state</strong> (like <M>{'|\\Phi^+\\rangle'}</M>) cannot.</>,
          <>The Bell state <M>{'\\tfrac{1}{\\sqrt2}(|00\\rangle+|11\\rangle)'}</M> is made with just <strong>H then CNOT</strong>.</>,
          <>Measuring entangled qubits gives <strong>perfectly correlated</strong> random results — but no faster-than-light messaging.</>,
          <><strong>Bell's theorem</strong> proves these correlations aren't secretly pre-arranged hidden values.</>,
          <>Entanglement is the <strong>resource</strong> behind teleportation, dense coding, and the speedups in Part IV.</>,
        ]}
      />
    </>
  );
}
