import { H2, H3, P, Lead, Callout, PlainEnglish, Takeaways, CircuitDiagram, Code, DataTable, M, Eq } from '../toolkit';

export default function Shor() {
  return (
    <>
      <Lead>
        This is the algorithm that made the world pay attention. In 1994 Peter Shor showed a quantum computer
        could factor large numbers efficiently — and factoring is the lock on nearly all of today's public-key
        cryptography. Shor's algorithm is the reason “quantum-safe encryption” is a boardroom topic. And in
        CasimirQ, it runs for real, using genuine quantum order finding.
      </Lead>

      <H2>Why factoring guards the internet</H2>
      <P>
        RSA encryption rests on a lopsided bet: multiplying two large primes is trivial, but recovering them
        from the product is believed to be astronomically hard. The best classical algorithms take{' '}
        <em>sub-exponential</em> time — enough that a 2048-bit key is safe against every classical computer on
        Earth. Shor's algorithm collapses that hardness to a <strong>polynomial</strong>{' '}
        <M>{'O((\\log N)^3)'}</M>.
      </P>

      <H2>The key insight: factoring is period finding</H2>
      <P>
        Shor's genius was to turn factoring — which looks nothing like a quantum problem — into a question about
        <strong> periodicity</strong>, which quantum computers answer superbly. Pick a random <M>{'a'}</M>{' '}
        coprime to <M>{'N'}</M> and look at the sequence of powers modulo <M>{'N'}</M>:
      </P>
      <Eq>{'a^0,\\; a^1,\\; a^2,\\; a^3,\\;\\ldots \\pmod N'}</Eq>
      <P>
        This sequence always <em>repeats</em> with some period <M>{'r'}</M> — the smallest{' '}
        <M>{'r'}</M> with <M>{'a^r \\equiv 1 \\pmod N'}</M>. Find that period and, provided it's even and{' '}
        <M>{'a^{r/2} \\not\\equiv -1'}</M>, elementary number theory hands you factors of <M>{'N'}</M>:
      </P>
      <Eq>{'\\gcd\\!\\big(a^{r/2}-1,\\,N\\big) \\;\\text{and}\\; \\gcd\\!\\big(a^{r/2}+1,\\,N\\big)'}</Eq>

      <PlainEnglish>
        Factoring 15 sounds like an algebra puzzle. Shor reframes it as: “I have a repeating drumbeat; how many
        beats until it loops?” Quantum computers are extraordinary at hearing the tempo of a repeating pattern —
        that's exactly what phase estimation does — so Shor smuggles the hard number-theory question into a
        rhythm the quantum computer can tap out.
      </PlainEnglish>

      <H2>Finding the period with QPE</H2>
      <P>
        The classical parts — choosing <M>{'a'}</M>, computing GCDs — are easy. The one step no classical
        computer can do efficiently is finding the period <M>{'r'}</M>, and that's the quantum core. Shor's
        circuit is <strong>phase estimation</strong> (Chapter 12) applied to the modular-multiplication
        operator <M>{'U_a|y\\rangle = |ay \\bmod N\\rangle'}</M>. Its eigenphases are multiples of{' '}
        <M>{'1/r'}</M>, so estimating a phase and running it through <em>continued fractions</em> reveals{' '}
        <M>{'r'}</M>.
      </P>
      <CircuitDiagram
        qubits={['count (t) |0⟩', 'work |1⟩']}
        cols={[
          { boxes: [{ wire: 0, label: 'H⊗ᵗ', family: 'h' }], tag: 'superpose' },
          { ctrl: { controls: [0], target: 1, kind: 'box', label: 'aˣ mod N', family: 'oracle' }, tag: 'modular exp' },
          { boxes: [{ wire: 0, label: 'QFT†', family: 'rot' }], tag: 'read period' },
          { measure: [0] },
        ]}
        caption="Shor's quantum core: controlled modular exponentiation imprints the period on the counting register; the inverse QFT + continued fractions extract r."
      />

      <Callout kind="key" title="CasimirQ does this genuinely">
        It would be easy to fake Shor by computing the period classically and dressing it up. CasimirQ doesn't.
        It synthesizes the modular-multiplication unitary as an actual permutation of basis states, runs true
        phase estimation over it, reads a measured phase, and recovers the period via continued fractions —
        exactly the quantum procedure Shor described. The honesty has a price, which we'll name in a moment.
      </Callout>

      <H2>Worked example: factoring 15</H2>
      <P>
        Take <M>{'N=15'}</M> and <M>{'a=7'}</M>. The powers of 7 mod 15 cycle as{' '}
        <M>{'7, 4, 13, 1, 7, 4, 13, 1,\\ldots'}</M> — period <M>{'r=4'}</M>. It's even, and{' '}
        <M>{'7^{2}=49\\equiv 4 \\pmod{15}'}</M>, which is not <M>{'-1'}</M>. So:
      </P>
      <DataTable
        head={['Step', 'Computation', 'Result']}
        rows={[
          ['Pick a', <>random coprime to 15</>, <M>{'a=7'}</M>],
          ['Quantum: find period', 'phase estimation on U₇', <M>{'r=4'}</M>],
          ['Compute a^{r/2}', <M>{'7^{2} \\bmod 15'}</M>, <M>{'4'}</M>],
          ['gcd(a^{r/2}−1, N)', <M>{'\\gcd(3,15)'}</M>, <strong>3</strong>],
          ['gcd(a^{r/2}+1, N)', <M>{'\\gcd(5,15)'}</M>, <strong>5</strong>],
        ]}
      />
      <P>And there they are: <M>{'15 = 3 \\times 5'}</M>, discovered through a genuinely quantum period found on the simulator.</P>
      <Code
        lang="rust"
        title="shor via casq-sdk"
        code={`// Factor 15 using genuine quantum order finding.
let shor = client.algorithms().shor(15).await?;

println!("factors = {:?}", shor.factors);   // [3, 5]
println!("base a   = {:?}", shor.base);      // e.g. Some(7)
println!("period r = {}", shor.period);      // 4`}
      />

      <Callout kind="warn" title="The honest limit">
        Genuine order finding means simulating the full modular-arithmetic unitary, whose register grows with{' '}
        <M>{'N'}</M>. On a classical simulator that hits the exponential wall from Chapter 9 quickly, so
        CasimirQ caps <M>{'N'}</M> (numbers like 35 or 77 are refused rather than faked). This is a feature, not
        a bug: it tells the truth about what simulation can and cannot do. Breaking real RSA needs thousands of
        error-corrected qubits — hardware that does not yet exist.
      </Callout>

      <H3>What this means for cryptography</H3>
      <P>
        Shor's algorithm doesn't threaten your bank today — the machines aren't big enough. But it guarantees
        that <em>eventually</em> they will be, which is why the world is already migrating to{' '}
        <strong>post-quantum cryptography</strong>: new schemes based on problems (like lattice reduction) that
        no known quantum algorithm cracks. “Harvest now, decrypt later” attacks make this urgent even before the
        hardware arrives.
      </P>

      <Takeaways
        items={[
          <><strong>Shor</strong> factors integers in polynomial time, breaking RSA-style cryptography — on a large enough quantum computer.</>,
          <>Its trick: <strong>factoring becomes period finding</strong>, and period finding is <strong>phase estimation</strong>.</>,
          <>Given the period <M>{'r'}</M>, factors fall out of <M>{'\\gcd(a^{r/2}\\pm1, N)'}</M>.</>,
          <>CasimirQ finds the period <strong>genuinely</strong> (real modular unitary + QPE + continued fractions), honestly capping <M>{'N'}</M>.</>,
          <>The looming threat is driving the shift to <strong>post-quantum cryptography</strong> today.</>,
        ]}
      />
    </>
  );
}
