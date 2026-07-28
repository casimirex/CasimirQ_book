import { H2, H3, P, Lead, Callout, PlainEnglish, Takeaways, CircuitDiagram, M, Eq } from '../toolkit';

export default function Superposition() {
  return (
    <>
      <Lead>
        Superposition gets all the headlines, but on its own it is not enough to beat a classical computer.
        The real story is a two-act play: first you spread a qubit across many possibilities, then you make
        those possibilities <em>interfere</em>. This chapter is where quantum computing stops being a metaphor
        and starts being an engineering discipline.
      </Lead>

      <H2>Creating superposition: the Hadamard gate</H2>
      <P>
        The workhorse that turns a definite qubit into an even blend is the <strong>Hadamard gate</strong>,{' '}
        <M>{'H'}</M>. Apply it to <M>{'|0\\rangle'}</M> and you get the equal superposition{' '}
        <M>{'|+\\rangle'}</M>:
      </P>
      <Eq>{'H|0\\rangle = \\tfrac{1}{\\sqrt2}\\big(|0\\rangle + |1\\rangle\\big) = |+\\rangle'}</Eq>
      <P>
        Now both outcomes are equally likely: <M>{'P(0)=P(1)=\\tfrac12'}</M>. Apply <M>{'H'}</M> to{' '}
        <M>{'|1\\rangle'}</M> instead and you get <M>{'|-\\rangle'}</M> — same 50/50 odds, but with a{' '}
        <em>minus sign</em> hiding in the amplitude of <M>{'|1\\rangle'}</M>. Remember from the last chapter:
        that sign is a phase, and phases are where the power lives.
      </P>

      <CircuitDiagram
        qubits={['|0⟩']}
        cols={[{ boxes: [{ wire: 0, label: 'H' }] }, { measure: [0] }]}
        caption="The simplest quantum program: one Hadamard turns a definite qubit into a fair coin."
      />

      <H2>The double-Hadamard: superposition is not randomness</H2>
      <P>
        Here is the experiment that separates people who <em>get</em> quantum computing from people who don't.
        Take <M>{'|0\\rangle'}</M>, apply <M>{'H'}</M>, then apply <M>{'H'}</M> again. If <M>{'H'}</M> were
        just a coin-flipper, two flips would leave you at 50/50. Instead:
      </P>
      <Eq>{'H\\,H\\,|0\\rangle = |0\\rangle \\quad\\Rightarrow\\quad P(0)=1'}</Eq>

      <CircuitDiagram
        qubits={['|0⟩']}
        cols={[
          { boxes: [{ wire: 0, label: 'H' }], tag: 'spread' },
          { boxes: [{ wire: 0, label: 'H' }], tag: 'interfere' },
          { measure: [0] },
        ]}
        caption="Two Hadamards return to |0⟩ with certainty — the second H makes the |1⟩ paths cancel."
      />

      <P>
        The qubit comes back to <M>{'|0\\rangle'}</M> with <em>certainty</em>. Why? After the first{' '}
        <M>{'H'}</M> the state is <M>{'\\tfrac{1}{\\sqrt2}(|0\\rangle+|1\\rangle)'}</M>. The second{' '}
        <M>{'H'}</M> sends <M>{'|0\\rangle\\to\\tfrac{1}{\\sqrt2}(|0\\rangle+|1\\rangle)'}</M> and{' '}
        <M>{'|1\\rangle\\to\\tfrac{1}{\\sqrt2}(|0\\rangle-|1\\rangle)'}</M>. Add them up:
      </P>
      <Eq>{'\\tfrac12(|0\\rangle+|1\\rangle) + \\tfrac12(|0\\rangle-|1\\rangle) = |0\\rangle + \\underbrace{0\\cdot|1\\rangle}_{\\text{cancelled!}}'}</Eq>

      <Callout kind="key" title="This is the whole game">
        The <M>{'|1\\rangle'}</M> amplitudes were <M>{'+\\tfrac12'}</M> and <M>{'-\\tfrac12'}</M>. They
        <strong> destructively interfered</strong> to zero, while the <M>{'|0\\rangle'}</M> amplitudes
        reinforced. A random process could never do this — randomness only ever blurs, it never sharpens.
        Superposition + interference sharpens.
      </Callout>

      <PlainEnglish>
        Superposition alone is like shouting every possible answer at once — useless noise. Interference is the
        acoustics of the room: shape it right and the wrong answers echo into silence while the correct answer
        rings out clearly. Quantum programming is really the craft of designing that room.
      </PlainEnglish>

      <H2>Measurement: the one-way door</H2>
      <P>
        Measurement is quantum computing's most dramatic and most restrictive rule. Before measuring, a qubit
        can be a rich superposition. The instant you measure, three things happen at once:
      </P>
      <P>
        <strong>It collapses.</strong> The state jumps to whichever basis state you observed —{' '}
        <M>{'|0\\rangle'}</M> or <M>{'|1\\rangle'}</M>. <strong>It's random.</strong> Which one you get follows
        the Born-rule probabilities, and nothing (not even the universe) knew in advance. <strong>It's
        destructive.</strong> The superposition is gone; re-measuring just gives the same value. All the
        delicate amplitude information you built up is reduced to a single classical bit.
      </P>

      <Callout kind="warn" title="No-cloning: you can't photocopy a qubit">
        You might hope to dodge the destructiveness by copying the qubit first and measuring the copy. You
        can't. The <strong>no-cloning theorem</strong> proves that no operation can duplicate an unknown
        quantum state. This is why quantum algorithms must extract their answer through careful interference —
        you get exactly one look.
      </Callout>

      <H3>Sampling: reading answers by repetition</H3>
      <P>
        Because one measurement yields one bit, we learn a quantum state's statistics by running the circuit
        many times — each run is a <strong>shot</strong>. A thousand shots of <M>{'H|0\\rangle'}</M> gives
        roughly 500 zeros and 500 ones. In CasimirQ you'll set a shot count (often 1024) and the platform
        returns a histogram of outcomes. A good algorithm is designed so that the <em>right</em> answer
        dominates that histogram, so even a few hundred shots reveal it.
      </P>

      <H2>Why not just try all inputs at once?</H2>
      <P>
        A tempting misconception: “put every input in superposition, run the function once, and read off all
        the answers.” The first half works — a quantum computer really can evaluate{' '}
        <M>{'f(x)'}</M> on a superposition of all <M>{'x'}</M> in a single call. The trap is the second half:
        measurement gives you only <em>one</em> random <M>{'x, f(x)'}</M> pair, and the superposition
        collapses. The exponential parallelism is real but <strong>locked behind measurement</strong>.
      </P>
      <P>
        Every algorithm in Part IV is a different key to that lock. Deutsch-Jozsa extracts a global property.
        Grover amplifies one marked answer. Shor uses interference to expose a hidden period. None of them
        “read all the answers” — they each coax the <em>one</em> fact you want into the open.
      </P>

      <Takeaways
        items={[
          <>The <strong>Hadamard</strong> gate creates equal superposition; its sign choices plant the phases that later interfere.</>,
          <><strong>Superposition ≠ randomness.</strong> Two Hadamards return <M>{'|0\\rangle'}</M> with certainty because <M>{'|1\\rangle'}</M> paths cancel.</>,
          <><strong>Measurement</strong> collapses the state, is random by the Born rule, and destroys the superposition — you get one bit per shot.</>,
          <>The <strong>no-cloning theorem</strong> forbids copying an unknown qubit.</>,
          <>Quantum parallelism is real but locked behind measurement; algorithms are keys built from <strong>interference</strong>.</>,
        ]}
      />
    </>
  );
}
