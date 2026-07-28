import { H2, H3, P, Lead, Callout, Takeaways, Code, DataTable, OL, LI } from '../toolkit';

export default function Capstone() {
  return (
    <>
      <Lead>
        You started this book unsure what a qubit was. You now understand superposition, entanglement, gates,
        and fourteen real algorithms — and you can run every one of them three ways. This final chapter is your
        graduation: a hands-on capstone that stitches the whole journey together, and a map of where to go next.
      </Lead>

      <H2>The capstone: a quantum benchmark suite</H2>
      <P>
        Your mission is to build a small program that exercises the platform end-to-end and reports what it
        learned — a “quantum benchmark suite” that proves you can drive CasimirQ like a professional. It touches
        a circuit, an oracle, a search, and a factoring, then summarizes the results. Everything you need is in
        the chapters behind you.
      </P>

      <H3>Step 1 — Prove entanglement</H3>
      <P>
        Build the Bell state and confirm it only ever yields <code>00</code> and <code>11</code>. This is your
        “is the pipeline alive?” smoke test.
      </P>
      <Code
        lang="rust"
        title="capstone.rs — part 1"
        code={`use casq_sdk::{Circuit, Client, Engine, RunOptions};

#[tokio::main]
async fn main() -> casq_sdk::Result<()> {
    let mut client = Client::new("http://localhost:8080/api/v1")?;
    client.login("admin@example.com", "admin123").await?;

    // 1. Entanglement smoke test.
    let mut bell = Circuit::new(2);
    bell.h(0).cx(0, 1);
    let r = client.run(&bell, RunOptions::new().engine(Engine::Statevector).shots(1024)).await?;
    let forbidden: usize = r.counts().iter()
        .filter(|(s, _)| *s == "01" || *s == "10").map(|(_, n)| *n).sum();
    assert_eq!(forbidden, 0, "entanglement broken!");
    println!("[1] Bell state: OK (no forbidden outcomes)");`}
      />

      <H3>Step 2 — Recover a secret, search a space, factor a number</H3>
      <P>
        Now put three algorithms through their paces and collect their headline numbers.
      </P>
      <Code
        lang="rust"
        title="capstone.rs — part 2"
        code={`    let algos = client.algorithms();

    // 2. Bernstein-Vazirani: steal a hidden string in one query.
    let bv = algos.bernstein_vazirani(0b1101).await?;
    println!("[2] BV recovered s = {}", bv.secret);

    // 3. Grover: find item 42 among 64 (6 qubits), optimal iterations.
    let grover = algos.grover(6, 42, None).await?;
    println!("[3] Grover success = {:.3} in {} iters",
        grover.success_probability, grover.iterations);

    // 4. Shor: factor 21 with genuine order finding.
    let shor = algos.shor(21).await?;
    println!("[4] Shor(21) factors = {:?}, period = {}",
        shor.factors, shor.period);

    println!("\\nCapstone complete — you drove CasimirQ end to end.");
    Ok(())
}`}
      />
      <Callout kind="idea" title="Extend it">
        Once it runs, make it yours: sweep Grover's iteration count and plot success probability rising and
        falling (Chapter 13's over-rotation lesson made visible); run VQE on the <code>H2</code> example and
        compare to the known ground-state energy; or add the Noise Lab and watch fidelity degrade. Each
        extension is a chapter of this book turned into an experiment.
      </Callout>

      <H2>Your novice-to-professional roadmap</H2>
      <P>
        You've covered the foundations that every quantum engineer shares. Here's an honest map of where you are
        and what lies beyond this book.
      </P>
      <DataTable
        head={['Level', 'You can…', 'Covered here?']}
        rows={[
          ['Novice', 'Explain qubits, superposition, entanglement to a friend', '✅ Part I'],
          ['Practitioner', 'Build circuits and run the core algorithms', '✅ Parts II–IV'],
          ['Builder', 'Automate CasimirQ via SDK and API', '✅ Part V'],
          ['Specialist', 'Design ansätze, error-correct, target real hardware', '→ next steps'],
          ['Researcher', 'Invent new algorithms and prove their speedups', '→ the frontier'],
        ]}
      />

      <H3>Where to go next</H3>
      <OL>
        <LI><strong>Quantum error correction.</strong> The bridge from noisy qubits to reliable ones — surface codes, stabilizers, logical qubits. It's the biggest engineering story in the field.</LI>
        <LI><strong>Real hardware.</strong> Move a transpiled circuit from CasimirQ's simulator toward a physical device and confront calibration, connectivity, and noise for real.</LI>
        <LI><strong>Quantum machine learning.</strong> Follow the variational thread from Chapter 18 into quantum kernels, data encodings, and barren-plateau pitfalls.</LI>
        <LI><strong>The theory.</strong> Nielsen &amp; Chuang's <em>Quantum Computation and Quantum Information</em> remains the canonical deep dive when you want every proof.</LI>
      </OL>

      <Callout kind="key" title="The one idea to keep">
        If you remember a single thing from this whole book, make it this: <strong>quantum computing is the art
        of arranging interference.</strong> Superposition creates the possibilities, entanglement correlates
        them, and gates choreograph their phases so the wrong answers cancel and the right one rings out. Every
        algorithm you met — Deutsch-Jozsa, Grover, Shor, VQE — is a different melody played on that one
        instrument.
      </Callout>

      <H2>Turn the universe, and look</H2>
      <P>
        The hero on this book's cover turns slowly — a galaxy of possibilities with a single qubit glowing at
        its heart. That was the promise: that a curious beginner and a working engineer could both stand before
        that turning universe and understand what they were seeing. If a qubit is now an old friend, if a
        circuit reads like sheet music, and if you can factor 15 on a simulator and explain <em>why</em> it
        works — then this book did its job. The rest of the universe is waiting. Go compute it.
      </P>

      <Takeaways
        items={[
          <>The <strong>capstone</strong> exercises entanglement, an oracle, a search, and a factoring end-to-end via the SDK.</>,
          <>You've reached <strong>Builder</strong> level: you can explain, build, and automate quantum computing.</>,
          <>Next frontiers: <strong>error correction, real hardware, QML, and the theory</strong>.</>,
          <>The unifying idea: <strong>quantum computing is the art of arranging interference</strong>.</>,
          <>You made the universe turn — now go compute it.</>,
        ]}
      />
    </>
  );
}
