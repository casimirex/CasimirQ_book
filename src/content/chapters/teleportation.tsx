import { H2, H3, P, Lead, Callout, PlainEnglish, Takeaways, CircuitDiagram, Code, DataTable, M, Eq } from '../toolkit';

export default function Teleportation() {
  return (
    <>
      <Lead>
        The name promises Star Trek; the reality is subtler and, in its way, more profound. Quantum
        teleportation moves an unknown qubit's <em>state</em> from one place to another without the qubit itself
        travelling — using entanglement and two classical bits. It's the protocol that ties this whole book
        together, because it uses every idea we've built.
      </Lead>

      <H2>The problem it solves</H2>
      <P>
        Alice has a qubit in some unknown state <M>{'|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle'}</M>{' '}
        and wants Bob to have it. She can't just measure it (that would collapse it and lose{' '}
        <M>{'\\alpha,\\beta'}</M>), and she can't clone it (the no-cloning theorem from Chapter 3 forbids
        copies). It seems impossible to transfer a state you're not even allowed to look at.
      </P>

      <H2>The recipe</H2>
      <P>
        Teleportation needs one pre-shared resource: an entangled Bell pair, one half held by Alice, the other
        by Bob. Then three steps:
      </P>
      <P>
        <strong>1. Entangle & measure.</strong> Alice interacts her unknown qubit with her half of the Bell pair
        (a CNOT and a Hadamard), then measures both her qubits, getting two classical bits.{' '}
        <strong>2. Send bits.</strong> She phones those two bits to Bob over an ordinary channel.{' '}
        <strong>3. Correct.</strong> Depending on the bits, Bob applies an <M>{'X'}</M> and/or <M>{'Z'}</M> to
        his half — and it snaps into exactly <M>{'|\\psi\\rangle'}</M>.
      </P>
      <CircuitDiagram
        qubits={['ψ (Alice)', 'a (Bell)', 'b (Bob)']}
        cols={[
          { boxes: [{ wire: 1, label: 'H' }], tag: 'make Bell' },
          { ctrl: { controls: [1], target: 2, kind: 'x' } },
          { barrier: true },
          { ctrl: { controls: [0], target: 1, kind: 'x' }, tag: 'Bell measure' },
          { boxes: [{ wire: 0, label: 'H' }] },
          { measure: [0, 1] },
          { barrier: true },
          { ctrl: { controls: [1], target: 2, kind: 'x', family: 'pauli' }, tag: 'correct X' },
          { ctrl: { controls: [0], target: 2, kind: 'z' }, tag: 'correct Z' },
        ]}
        caption="Teleportation: build a Bell pair, Bell-measure Alice's two qubits, then Bob applies X/Z corrections conditioned on the two classical bits."
      />

      <PlainEnglish>
        Alice can't send you the original painting (measuring destroys it, copying is banned). Instead she and
        Bob share a pair of magic mirrors — the entangled pair. Alice compares the painting to her mirror,
        writes down two numbers describing the difference, and texts them to Bob. Bob makes exactly those two
        adjustments to <em>his</em> mirror, and the painting reassembles on his side. The original is gone; a
        perfect twin appears elsewhere.
      </PlainEnglish>

      <H2>Two rules it does not break</H2>
      <Callout kind="warn" title="No faster-than-light, no cloning">
        Teleportation feels like it should send information instantly — but Bob's qubit is useless <em>random
        noise</em> until Alice's two classical bits arrive over a normal, light-speed-limited channel. And no
        copy is ever made: the instant Alice measures, her original state is destroyed. Exactly one copy of{' '}
        <M>{'|\\psi\\rangle'}</M> exists at every moment. Relativity and no-cloning both stand.
      </Callout>
      <DataTable
        head={['Measured bits (a, ψ)', "Bob's correction"]}
        rows={[
          ['00', <>identity (already <M>{'|\\psi\\rangle'}</M>)</>],
          ['01', <M>{'X'}</M>],
          ['10', <M>{'Z'}</M>],
          ['11', <M>{'ZX'}</M>],
        ]}
      />

      <H2>Why it matters</H2>
      <P>
        Teleportation isn't about transporting matter — it's the backbone of quantum <em>networking</em>. It's
        how a future <strong>quantum internet</strong> would move fragile states between chips and cities, how
        distributed quantum computers would share qubits, and a core primitive in quantum error correction
        (which teleports logical states between code blocks). It also crisply demonstrates the currency
        conversion at the heart of the field: <strong>one entangled pair + two classical bits = one transmitted
        qubit</strong>.
      </P>

      <H3>In CasimirQ</H3>
      <P>
        CasimirQ's <strong>Quantum Teleportation</strong> algorithm prepares an arbitrary input state from
        amplitudes you supply, runs the full protocol, and reports the <strong>fidelity</strong> between Bob's
        output and Alice's original — plus a boolean confirming the transfer verified. A fidelity of 1.0 means
        the state arrived perfectly.
      </P>
      <Code
        lang="rust"
        title="teleportation via casq-sdk"
        code={`// Teleport the state 0.6|0> + 0.8|1> from Alice to Bob.
let tele = client.algorithms().teleport(0.6, 0.8).await?;

println!("fidelity = {:.4}", tele.fidelity);  // 1.0000
println!("verified  = {}", tele.verified);     // true`}
      />
      <Eq>{'\\text{1 Bell pair} \\; + \\; \\text{2 classical bits} \\; = \\; \\text{1 teleported qubit}'}</Eq>

      <Takeaways
        items={[
          <><strong>Teleportation</strong> moves an unknown qubit's state using a shared Bell pair + two classical bits — no cloning, no FTL.</>,
          <>Alice <strong>Bell-measures</strong>; Bob applies <M>{'X'}</M>/<M>{'Z'}</M> corrections based on her two bits.</>,
          <>Bob's qubit is random until the classical bits arrive — <strong>relativity is safe</strong>.</>,
          <>It's the foundation of the <strong>quantum internet</strong> and a primitive in error correction.</>,
          <>CasimirQ teleports an arbitrary state and reports <strong>fidelity</strong> (1.0 = perfect).</>,
        ]}
      />
    </>
  );
}
