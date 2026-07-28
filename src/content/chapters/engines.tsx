import { H2, H3, P, Lead, Callout, PlainEnglish, Takeaways, Figure, DataTable, M, Eq } from '../toolkit';

export default function Engines() {
  return (
    <>
      <Lead>
        When you press “run,” what actually happens? CasimirQ hands your circuit to a <em>simulation engine</em>{' '}
        that computes how the quantum state evolves. Understanding the engines — what they compute, and what it
        costs — is the difference between using the platform and understanding it.
      </Lead>

      <H2>The statevector engine: exact truth</H2>
      <P>
        The default engine is the <strong>statevector simulator</strong>. It stores the full quantum state as a
        list of <M>{'2^n'}</M> complex amplitudes and, for each gate, multiplies that vector by the gate's
        matrix. Nothing is approximated: the amplitudes it reports are the exact, textbook-correct state.
      </P>
      <Eq>{'|\\psi_{t+1}\\rangle = U_{\\text{gate}}\\,|\\psi_t\\rangle'}</Eq>
      <P>
        This exactness is why the statevector engine is perfect for learning and for verifying algorithms — you
        can read off amplitudes, phases, and probabilities directly. The catch is memory. Each added qubit{' '}
        <em>doubles</em> the state:
      </P>
      <DataTable
        head={['Qubits', 'Amplitudes', 'Memory (complex128)']}
        rows={[
          ['10', '1,024', '~16 KB'],
          ['20', '~1 million', '~16 MB'],
          ['30', '~1 billion', '~16 GB'],
          ['40', '~1 trillion', '~16 TB — impractical'],
        ]}
      />
      <Callout kind="warn" title="The exponential wall">
        Around 30–40 qubits, exact simulation exhausts any classical machine. This isn't a CasimirQ limitation —
        it's <em>the</em> reason quantum computers are interesting. If we could easily simulate 100 qubits, we
        wouldn't need to build them. Every simulator lives on the near side of this wall.
      </Callout>

      <H2>Sampling: from amplitudes to shots</H2>
      <P>
        The statevector is the whole truth, but a real quantum computer never hands you amplitudes — only
        measurement outcomes. To mimic that, the engine <strong>samples</strong>: it draws measurement results
        according to the Born-rule probabilities <M>{'|\\alpha_k|^2'}</M>, once per shot, and tallies them into
        a histogram.
      </P>
      <PlainEnglish>
        The statevector is the loaded dice — the engine knows the exact bias of every face. “Shots” are actual
        rolls of those dice. Ask for 1024 shots and you roll 1024 times; the histogram of results is what a real
        quantum chip would give you.
      </PlainEnglish>

      <Figure
        src="/screenshots/simulations.png"
        alt="The CasimirQ Simulations page showing engine selection, shots, and result visualizations."
        caption="The Simulations workspace. Pick an engine, set your shot count, run, and inspect the outcome distribution and statevector."
      />

      <H2>Choosing an engine</H2>
      <P>
        CasimirQ exposes the engine choice on every run — in the UI, in the SDK (<code>Engine::Statevector</code>),
        and in the API (<code>"engine": "statevector"</code>). As a rule of thumb:
      </P>
      <DataTable
        head={['You want to…', 'Reach for']}
        rows={[
          ['See exact amplitudes and phases while learning', 'Statevector, few shots'],
          ['Reproduce what real hardware would output', 'Statevector, many shots (1024+)'],
          ['Study how noise degrades a result', 'Noise Lab (next chapter)'],
          ['Prepare a circuit for a specific device', 'Transpile (next chapter)'],
        ]}
      />

      <H3>How CasimirQ verifies its own algorithms</H3>
      <P>
        Because the statevector engine is exact, the platform uses it to <strong>self-check</strong>. Every
        built-in algorithm ships with a verification path: it computes the expected answer independently (a
        classical reference) and confirms the quantum circuit's statevector agrees. When Chapter 14 claims
        Shor's algorithm genuinely factors 15 via quantum order finding, that claim is backed by this exact
        engine confirming the period read out of the circuit — not by a classical shortcut.
      </P>

      <Callout kind="key" title="Simulation is a scaffold, not the destination">
        A simulator lets you learn, debug, and verify quantum algorithms today, on hardware you already own.
        The very cost that caps it at ~30 qubits is the promise of quantum computing: beyond that wall lies
        computation no classical machine can follow. CasimirQ keeps you productive right up to the edge of it.
      </Callout>

      <Takeaways
        items={[
          <>The <strong>statevector engine</strong> evolves all <M>{'2^n'}</M> amplitudes exactly — ideal for learning and verification.</>,
          <>Memory <strong>doubles per qubit</strong>, hitting a practical wall near 30–40 qubits — the reason real quantum computers matter.</>,
          <><strong>Shots</strong> sample the exact state by the Born rule, reproducing what hardware would return.</>,
          <>CasimirQ uses the exact engine to <strong>self-verify</strong> its built-in algorithms.</>,
        ]}
      />
    </>
  );
}
