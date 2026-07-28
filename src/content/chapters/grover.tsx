import { H2, H3, P, Lead, Callout, PlainEnglish, Takeaways, Figure, CircuitDiagram, Code, M, Eq } from '../toolkit';

export default function Grover() {
  return (
    <>
      <Lead>
        You've lost your keys somewhere in a house of a million rooms, and there's no clue where. Classically
        you check rooms one by one — half a million on average. Grover's algorithm finds them in about a{' '}
        <em>thousand</em> steps. This is the most broadly useful quantum speedup, and it's a masterclass in
        interference.
      </Lead>

      <H2>The unstructured search problem</H2>
      <P>
        You have <M>{'N = 2^n'}</M> items and a way to recognize the one you want — an oracle that returns 1 on
        the “marked” item and 0 otherwise. With no structure to exploit, a classical search needs{' '}
        <M>{'O(N)'}</M> queries. Grover needs only <M>{'O(\\sqrt{N})'}</M> — a <strong>quadratic
        speedup</strong>. For a million items, that's the difference between ~500,000 checks and ~1,000.
      </P>

      <H2>Amplitude amplification: two mirrors</H2>
      <P>
        Grover starts in the equal superposition of all items — every one equally likely. Then it repeats a
        two-step move that slowly pumps amplitude into the marked item:
      </P>
      <P>
        <strong>Step 1 — the oracle</strong> flips the <em>sign</em> of the marked item's amplitude (phase
        kickback again), leaving all others alone. <strong>Step 2 — the diffuser</strong> reflects every
        amplitude about their average. Together these two reflections rotate the state, in the plane spanned by
        “marked” and “everything else,” a little closer to the answer each round.
      </P>
      <CircuitDiagram
        qubits={['q0 |0⟩', 'q1 |0⟩', 'q2 |0⟩']}
        cols={[
          { boxes: [{ wire: 0, label: 'H' }, { wire: 1, label: 'H' }, { wire: 2, label: 'H' }], tag: 'init' },
          { boxes: [{ wire: 0, label: 'Uf', family: 'oracle' }, { wire: 1, label: 'Uf', family: 'oracle' }, { wire: 2, label: 'Uf', family: 'oracle' }], tag: 'oracle' },
          { boxes: [{ wire: 0, label: 'Diff', family: 'rot' }, { wire: 1, label: 'Diff', family: 'rot' }, { wire: 2, label: 'Diff', family: 'rot' }], tag: 'diffuse' },
          { measure: [0, 1, 2] },
        ]}
        caption="One Grover iteration = oracle (mark) + diffuser (reflect about the mean). Repeat ≈ (π/4)√N times."
      />

      <PlainEnglish>
        Picture every item as a water level in a row of glasses, all equal at the start. The oracle secretly
        pushes the marked glass <em>below</em> the surface. The diffuser then flips every glass around the
        average level — and because the marked one was pushed down, it rebounds <em>highest</em>. Repeat, and
        the marked glass sloshes up toward certainty while the rest drain away.
      </PlainEnglish>

      <H2>Don't over-rotate!</H2>
      <P>
        Here's the counterintuitive twist that trips up newcomers: <strong>more iterations is not better</strong>.
        Each round rotates the state by a fixed angle toward the answer. Stop too early and the marked amplitude
        is still small; go too far and you rotate <em>past</em> it and start losing probability again. The
        optimal number of iterations is:
      </P>
      <Eq>{'R \\approx \\frac{\\pi}{4}\\sqrt{N}'}</Eq>
      <Callout kind="warn" title="Grover is a rotation, not a ratchet">
        Because the amplitude oscillates, running Grover “extra hard” for safety actively hurts. This is a
        genuinely quantum failure mode with no classical analogue — a classical search never gets{' '}
        <em>worse</em> the longer you look. CasimirQ picks the optimal iteration count for you by default, but
        you can override it to watch the success probability rise, peak, and fall.
      </Callout>

      <H2>Seeing it live in CasimirQ</H2>
      <P>
        On the Algorithms page, run <strong>Grover's Search</strong> over 4 qubits (16 items) looking for item
        9. CasimirQ computes the optimal iteration count and reports the resulting success probability. Here is
        an actual run from the platform:
      </P>
      <Figure
        src="/screenshots/algorithm-result.png"
        alt="A live Grover's Search run in CasimirQ reporting success probability 0.9613 and optimal iterations 3."
        caption="A real Grover run in CasimirQ: N=16, marked item 9. Three optimal iterations drive the success probability to 0.9613 — over 96% in a single measurement."
      />
      <P>
        Three iterations, 96% success. A classical search would expect ~8 checks to find one item in 16; Grover
        nails it with overwhelming probability in 3 — and the advantage widens as <M>{'N'}</M> grows.
      </P>
      <Code
        lang="rust"
        title="grover via casq-sdk"
        code={`// Search 16 items (4 qubits) for the marked item 9.
// Pass None to let the server choose the optimal iteration count.
let grover = client.algorithms().grover(4, 9, None).await?;

println!("success probability = {:.4}", grover.success_probability); // ~0.9613
println!("optimal iterations  = {}", grover.iterations);             // 3`}
      />

      <H3>Amplitude amplification: the general tool</H3>
      <P>
        Grover assumes you begin from a uniform superposition. Its generalization,{' '}
        <strong>Quantum Amplitude Amplification (QAA)</strong>, works from <em>any</em> state-preparation
        procedure <M>{'A'}</M>: it amplifies whatever “good” subspace you define, using the operator{' '}
        <M>{'Q = -A S_0 A^{-1} S_\\chi'}</M>. CasimirQ exposes QAA as its own algorithm, letting you supply the
        good states and starting amplitudes directly. It's the abstraction behind Grover and a building block in
        many quantum subroutines (counting, mean estimation, and more).
      </P>

      <Takeaways
        items={[
          <><strong>Grover</strong> searches <M>{'N'}</M> unstructured items in <M>{'O(\\sqrt N)'}</M> — a quadratic speedup.</>,
          <>Each iteration is <strong>oracle (mark) + diffuser (reflect about the mean)</strong>, rotating toward the answer.</>,
          <>Use about <M>{'\\tfrac{\\pi}{4}\\sqrt N'}</M> iterations — <strong>over-rotating makes it worse</strong>.</>,
          <>A live CasimirQ run hit <strong>96% success in 3 iterations</strong> over 16 items.</>,
          <><strong>Amplitude amplification</strong> generalizes Grover to any state preparation and good-state definition.</>,
        ]}
      />
    </>
  );
}
