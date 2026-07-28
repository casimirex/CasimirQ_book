import { H2, H3, P, Lead, Callout, Takeaways, Code, DataTable } from '../toolkit';

export default function Sdk() {
  return (
    <>
      <Lead>
        Clicking gates is how you learn; writing code is how you build. The <code>casq-sdk</code> crate lets you
        drive every capability of CasimirQ from real, async Rust — compose circuits, choose engines, run any of
        the 14 algorithms, and get back strongly-typed results. This chapter turns you from a reader into a
        practitioner.
      </Lead>

      <H2>Getting connected</H2>
      <P>
        The SDK is a thin, typed client over the REST API. You create a <code>Client</code>, authenticate once,
        and every subsequent call carries your token automatically. It's built on <code>tokio</code>, so
        everything is <code>async</code>.
      </P>
      <Code
        lang="toml"
        title="Cargo.toml"
        code={`[dependencies]
casq-sdk = "*"
tokio = { version = "1", features = ["full"] }`}
      />
      <Code
        lang="rust"
        title="connect.rs"
        code={`use casq_sdk::Client;

#[tokio::main]
async fn main() -> casq_sdk::Result<()> {
    // Point at your CasimirQ server's versioned API.
    let mut client = Client::new("http://localhost:8080/api/v1")?;

    // Authenticate once; the token is stored on the client.
    client.login("admin@example.com", "admin123").await?;

    // From here every call is ready to go.
    Ok(())
}`}
      />

      <H2>Building circuits fluently</H2>
      <P>
        The <code>Circuit</code> builder mirrors the diagrams from Part II. Methods chain, and each maps to a
        gate you already know. Here the API reads almost exactly like the picture.
      </P>
      <Code
        lang="rust"
        title="circuits.rs"
        code={`use casq_sdk::{Circuit, Engine, RunOptions};

// A 3-qubit GHZ state: H then a CNOT fan-out.
let mut ghz = Circuit::new(3);
ghz.h(0).cx(0, 1).cx(1, 2);

let result = client
    .run(&ghz, RunOptions::new().engine(Engine::Statevector).shots(1024))
    .await?;

// counts() -> a histogram of measured bitstrings.
for (state, n) in result.counts() {
    println!("|{state}> : {n}");   // |000> and |111> dominate
}
println!("depth = {}", result.metadata.depth);`}
      />
      <DataTable
        head={['Builder method', 'Gate', 'From chapter']}
        rows={[
          ['h, x, y, z', 'Pauli & Hadamard', '5'],
          ['s, t, sdg', 'phase gates', '5'],
          ['rx, ry, rz, p', 'rotations & phase', '5'],
          ['cx, cz, swap', 'two-qubit', '6'],
          ['ccx, mcx, mcz', 'multi-controlled', '6'],
        ]}
      />

      <H2>Every algorithm, typed</H2>
      <P>
        The real payoff is the <code>algorithms()</code> handle. Each of the 14 algorithms is a method that
        takes plain parameters and returns a struct with named fields — no JSON spelunking. You've seen these
        throughout Part IV; here they are gathered as one tour.
      </P>
      <Code
        lang="rust"
        title="algorithms_tour.rs"
        code={`let algos = client.algorithms();

// Fundamentals
let qft   = algos.qft(3).await?;
let dj    = algos.deutsch_jozsa(3, 0b101).await?;
let bv    = algos.bernstein_vazirani(0b1011).await?;
let simon = algos.simon(0b110).await?;
let qpe   = algos.phase_estimation(0.375, 4).await?;

// Search
let grover = algos.grover(4, 9, None).await?;
let qaa    = algos.amplitude_amplification(&[0b101], 3).await?;

// Cryptography & simulation
let shor = algos.shor(15).await?;
let walk = algos.quantum_walk(3, 6, true).await?;
let hhl  = algos.hhl(&[1.0, 0.0]).await?;

// Optimization
let vqe  = algos.vqe(2, &hamiltonian, Some(100)).await?;
let qaoa = algos.qaoa(3, &edges, Some(1)).await?;

println!("Shor(15) -> {:?}, period {}", shor.factors, shor.period);
println!("Grover   -> success {:.4}", grover.success_probability);`}
      />

      <Callout kind="key" title="Strong typing is the point">
        <code>shor.period</code> is an integer. <code>grover.success_probability</code> is an <code>f64</code>.
        <code>hhl.quantum_solution</code> is a vector of complex amplitudes. The compiler checks your usage
        before a single call goes out, so a whole class of “I misread the JSON shape” bugs simply can't happen.
        This is what makes the SDK the right tool for anything beyond a quick experiment.
      </Callout>

      <H3>Errors, engines, and options</H3>
      <P>
        Every call returns <code>casq_sdk::Result&lt;T&gt;</code>, so failures — a bad login, an out-of-range
        parameter, a server error — surface as ordinary Rust <code>Result</code>s you handle with <code>?</code>{' '}
        or <code>match</code>. <code>RunOptions</code> lets you pick the engine and shot count; the same options
        object works for any circuit. It's idiomatic Rust all the way down.
      </P>

      <H3>How the SDK stays honest</H3>
      <P>
        The crate ships with a <strong>contract test</strong> that checks its request shapes against the
        server's OpenAPI schema, and an <strong>integration test</strong> suite that runs every method against a
        live backend. That's why the examples in this book aren't aspirational — they're the same calls the
        test suite exercises on every change.
      </P>

      <Takeaways
        items={[
          <>The <strong>Rust SDK</strong> is a typed, async client: <code>Client::new</code> then <code>login</code>, and you're ready.</>,
          <>The <strong>Circuit builder</strong> mirrors the gate diagrams — <code>h</code>, <code>cx</code>, <code>rz</code>, <code>mcx</code>, and more.</>,
          <>The <strong>algorithms() handle</strong> exposes all 14 algorithms as methods returning strongly-typed structs.</>,
          <><strong>Errors</strong> are ordinary <code>Result</code>s; <strong>RunOptions</strong> selects engine and shots.</>,
          <>Contract + integration tests keep the SDK faithful to the live API.</>,
        ]}
      />
    </>
  );
}
