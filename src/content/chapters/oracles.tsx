import { H2, H3, P, Lead, Callout, PlainEnglish, Takeaways, Figure, CircuitDiagram, DataTable, Code, M, Eq } from '../toolkit';

export default function Oracles() {
  return (
    <>
      <Lead>
        The first algorithms to prove quantum computers can beat classical ones weren't practical — they solved
        contrived puzzles. But they revealed the <em>mechanism</em> of quantum advantage in its purest form.
        Meet the three oracle algorithms: Deutsch-Jozsa, Bernstein-Vazirani, and Simon. They're the “hello
        world” of quantum speedup, and CasimirQ runs all three.
      </Lead>

      <H2>What is an oracle?</H2>
      <P>
        An <strong>oracle</strong> is a black box that computes some function <M>{'f(x)'}</M> — you may query
        it, but you can't peek inside. The question each algorithm asks is: <em>how many queries do I need to
        learn a certain property of</em> <M>{'f'}</M>? Classically you often need many. Quantumly, thanks to
        superposition and a trick called phase kickback, you often need just one.
      </P>

      <H3>Phase kickback: the shared engine</H3>
      <P>
        All three algorithms run on the same clever move. Put the oracle's output qubit into the state{' '}
        <M>{'|-\\rangle=\\tfrac{1}{\\sqrt2}(|0\\rangle-|1\\rangle)'}</M>. Now when the oracle XORs{' '}
        <M>{'f(x)'}</M> onto it, the effect isn't to flip the output — it's to stamp a <em>phase</em>{' '}
        <M>{'(-1)^{f(x)}'}</M> onto the input:
      </P>
      <Eq>{'U_f\\,|x\\rangle|-\\rangle = (-1)^{f(x)}\\,|x\\rangle|-\\rangle'}</Eq>
      <PlainEnglish>
        Phase kickback is quantum sleight of hand: you ask the oracle a yes/no question, and instead of writing
        the answer somewhere you can read it, the answer bounces back as an invisible sign on your input. Do
        this to <em>all</em> inputs at once, then use interference to read out a global pattern of those signs.
      </PlainEnglish>

      <H2>Deutsch-Jozsa: constant or balanced?</H2>
      <P>
        You're given a function <M>{'f'}</M> on <M>{'n'}</M> bits, promised to be either{' '}
        <strong>constant</strong> (same output for every input) or <strong>balanced</strong> (0 on exactly half
        the inputs, 1 on the other half). Which is it?
      </P>
      <P>
        <strong>Classically:</strong> in the worst case you must check just over half the inputs —{' '}
        <M>{'2^{n-1}+1'}</M> queries — to be sure. <strong>Quantumly:</strong> exactly <strong>one</strong>{' '}
        query. Hadamard everything into superposition, apply the oracle (phase kickback stamps{' '}
        <M>{'(-1)^{f(x)}'}</M> on each <M>{'x'}</M>), Hadamard again, and measure.
      </P>
      <CircuitDiagram
        qubits={['x₀ |0⟩', 'x₁ |0⟩', 'anc |1⟩']}
        cols={[
          { boxes: [{ wire: 0, label: 'H' }, { wire: 1, label: 'H' }, { wire: 2, label: 'H' }], tag: 'superpose' },
          { boxes: [{ wire: 0, label: 'Uf', family: 'oracle' }, { wire: 1, label: 'Uf', family: 'oracle' }, { wire: 2, label: 'Uf', family: 'oracle' }], tag: 'oracle' },
          { boxes: [{ wire: 0, label: 'H' }, { wire: 1, label: 'H' }], tag: 'interfere' },
          { measure: [0, 1] },
        ]}
        caption="Deutsch-Jozsa. The ancilla starts in |1⟩ (→ |−⟩ after H) to enable phase kickback."
      />
      <P>
        The readout is beautifully binary: if you measure <strong>all zeros</strong>, the function is{' '}
        <strong>constant</strong>; any other result means <strong>balanced</strong>. The interference makes the
        all-zeros amplitude either fully reinforce (constant) or fully cancel (balanced). One query settles a
        question that could take exponentially many classically.
      </P>

      <H2>Bernstein-Vazirani: stealing a secret string</H2>
      <P>
        Now the oracle hides a secret bit-string <M>{'s'}</M>, and computes{' '}
        <M>{'f(x) = s \\cdot x \\bmod 2'}</M> (the parity of the bits where <M>{'s'}</M> is 1). Find{' '}
        <M>{'s'}</M>.
      </P>
      <P>
        <strong>Classically</strong> you'd probe one bit at a time: query <M>{'x=100\\ldots0'}</M> to get{' '}
        <M>{'s_0'}</M>, then <M>{'010\\ldots0'}</M> for <M>{'s_1'}</M>, and so on — <M>{'n'}</M> queries for{' '}
        <M>{'n'}</M> bits. <strong>Quantumly</strong>, the exact same circuit as Deutsch-Jozsa recovers the{' '}
        <em>entire</em> string in <strong>one</strong> query: measure the input register and it collapses
        straight to <M>{'|s\\rangle'}</M>.
      </P>
      <Callout kind="key" title="Why one query suffices">
        Phase kickback stamps <M>{'(-1)^{s\\cdot x}'}</M> across the superposition. That pattern of signs is
        exactly the Hadamard transform of <M>{'|s\\rangle'}</M>. Applying <M>{'H'}</M> again inverts the
        transform, and the register lands precisely on <M>{'s'}</M>. The secret was hiding in the phases the
        whole time.
      </Callout>

      <H2>Simon's algorithm: the exponential leap</H2>
      <P>
        The first two are neat but only polynomially faster. <strong>Simon's problem</strong> is the one that
        stunned the field, because its speedup is <em>exponential</em> — and because its structure directly
        inspired Shor. The oracle hides a secret period <M>{'s'}</M> such that{' '}
        <M>{'f(x) = f(x \\oplus s)'}</M> for all <M>{'x'}</M> (a 2-to-1 function). Find <M>{'s'}</M>.
      </P>
      <P>
        Classically you must hunt for a collision — two inputs with the same output — which needs about{' '}
        <M>{'2^{n/2}'}</M> queries. Quantumly, each run of Simon's circuit yields a random bit-string{' '}
        <M>{'y'}</M> guaranteed to satisfy <M>{'y \\cdot s = 0'}</M>. Collect about <M>{'n'}</M> such equations
        and solve the linear system over <M>{'\\text{GF}(2)'}</M> to recover <M>{'s'}</M>.
      </P>
      <DataTable
        head={['Algorithm', 'Learns', 'Classical', 'Quantum', 'Speedup']}
        rows={[
          ['Deutsch-Jozsa', 'constant vs balanced', <M>{'2^{n-1}+1'}</M>, '1 query', 'exponential*'],
          ['Bernstein-Vazirani', <>secret string <M>{'s'}</M></>, <M>{'n'}</M>, '1 query', 'linear'],
          ["Simon's", <>period <M>{'s'}</M></>, <M>{'\\sim 2^{n/2}'}</M>, <M>{'\\sim n'}</M>, 'exponential'],
        ]}
      />
      <p className="text-sm text-muted">
        *Exponential for exact/deterministic solving; a randomized classical algorithm can decide
        Deutsch-Jozsa in a few queries with high probability.
      </p>

      <H2>Running them in CasimirQ</H2>
      <P>
        All three live on the <strong>Algorithms</strong> page under the “Fundamental” category. Pick an
        oracle, run it, and read the result: Deutsch-Jozsa reports <em>constant</em> or <em>balanced</em>,
        Bernstein-Vazirani hands back the recovered string, and Simon's returns the period it solved for.
      </P>
      <Figure
        src="/screenshots/algorithms.png"
        alt="The CasimirQ Algorithms page with cards for the fundamental algorithms including Deutsch-Jozsa, Bernstein-Vazirani, and Simon."
        caption="The Algorithms gallery. The oracle algorithms sit in the 'Fundamental' category, each runnable in a click."
      />
      <Code
        lang="rust"
        title="oracles via casq-sdk"
        code={`let algos = client.algorithms();

// Deutsch-Jozsa on a balanced oracle over 3 bits.
let dj = algos.deutsch_jozsa(3, /* balanced mask */ 0b101).await?;
println!("verdict: {}", dj.verdict);          // "balanced"

// Bernstein-Vazirani recovers the hidden string in one query.
let bv = algos.bernstein_vazirani(0b1011).await?;
println!("recovered s = {}", bv.secret);      // "1011"

// Simon's finds the hidden period.
let simon = algos.simon(0b110).await?;
println!("period s = {}", simon.period);       // "110"`}
      />

      <Takeaways
        items={[
          <>An <strong>oracle</strong> is a queryable black box; these algorithms minimize the number of queries via <strong>phase kickback</strong>.</>,
          <><strong>Deutsch-Jozsa</strong> decides constant vs balanced in <strong>one</strong> query.</>,
          <><strong>Bernstein-Vazirani</strong> steals an <M>{'n'}</M>-bit secret in <strong>one</strong> query — it was hiding in the phases.</>,
          <><strong>Simon's</strong> delivers an <strong>exponential</strong> speedup and is the direct ancestor of Shor's period finding.</>,
          <>All three run from the CasimirQ <strong>Algorithms</strong> page, SDK, and API.</>,
        ]}
      />
    </>
  );
}
