import { H2, H3, P, Lead, Callout, Takeaways, Figure, Code, M, Eq } from '../toolkit';

export default function CircuitsInCasimirQ() {
  return (
    <>
      <Lead>
        Enough theory — let's build. In this chapter you'll create the Bell state from Chapter 4 three different
        ways in CasimirQ: by dragging gates in the visual builder, by writing Rust with the SDK, and by posting
        JSON to the API. Same circuit, three surfaces. This is the moment the book becomes hands-on.
      </Lead>

      <H2>Meet the Circuit Builder</H2>
      <P>
        Sign in to CasimirQ and open <strong>Circuit Builder</strong> from the sidebar. You get a canvas of
        qubit wires, a palette of gates, and a live view of the resulting statevector. Drop an <M>{'H'}</M> on
        the first wire, a <M>{'\\text{CNOT}'}</M> spanning both wires, and you've built entanglement with your
        mouse.
      </P>

      <Figure
        src="/screenshots/circuit-builder.png"
        alt="The CasimirQ Circuit Builder showing qubit wires, a gate palette, and circuit controls."
        caption="The CasimirQ Circuit Builder. Gates are dragged onto wires; the panel tracks qubit count, gate count, and depth as you go."
      />

      <P>
        Here is that exact circuit — <M>{'H'}</M> on q0 followed by a <M>{'\\text{CNOT}'}</M> targeting q1 —
        actually built and loaded on the CasimirQ canvas, not just drawn as a schematic:
      </P>
      <Figure
        src="/screenshots/builder-bell.png"
        alt="The CasimirQ Circuit Builder showing the Bell-state circuit on two labelled qubit wires: a Hadamard on q0 and a CNOT with its control on q0 connected to a ⊕ target on q1."
        caption="The Bell state, live in the builder. Gates snap onto horizontal qubit wires (|q0⟩, |q1⟩) so it reads like a real circuit diagram: the purple H sits on q0, and the CNOT is drawn as a control dot on q0 linked by a connector to the ⊕ target on q1. Two gates, one entangled pair — expected outcomes |00⟩ and |11⟩, each ≈ 50%."
      />

      <Callout kind="idea" title="What to watch as you build">
        Keep an eye on three numbers the builder reports: <strong>qubit count</strong> (width of your
        register), <strong>gate count</strong> (total operations), and <strong>depth</strong> (the number of
        sequential layers — your circuit's “height” in time). Depth matters enormously on real hardware, where
        every layer is a chance for noise to creep in.
      </Callout>

      <H2>Running it: shots and histograms</H2>
      <P>
        Press run and CasimirQ simulates the circuit, then samples it for a number of <strong>shots</strong>{' '}
        (say 1024). Because the Bell state is <M>{'\\tfrac{1}{\\sqrt2}(|00\\rangle+|11\\rangle)'}</M>, you'll
        get a histogram clustered on two bars:
      </P>
      <Eq>{'\\text{counts} \\approx \\{\\, |00\\rangle: 512,\\quad |11\\rangle: 512 \\,\\}'}</Eq>
      <P>
        The exact split wobbles run to run — that's the Born rule sampling in action — but <M>{'|01\\rangle'}</M>{' '}
        and <M>{'|10\\rangle'}</M> stay empty. Seeing those two clean bars is your first real confirmation that
        entanglement is not just algebra on a page.
      </P>

      <H2>The same circuit from the Rust SDK</H2>
      <P>
        The visual builder is wonderful for learning; for real work you'll want code. The{' '}
        <code>casq-sdk</code> crate speaks to the same backend. Here is the Bell state as a runnable Rust
        program — note how the circuit reads almost exactly like the diagram: <code>h(0)</code> then{' '}
        <code>cx(0, 1)</code>.
      </P>
      <Code
        lang="rust"
        title="bell_state.rs"
        code={`use casq_sdk::{Circuit, Client, Engine, RunOptions};

#[tokio::main]
async fn main() -> casq_sdk::Result<()> {
    // Connect and authenticate against a running CasimirQ server.
    let mut client = Client::new("http://localhost:8080/api/v1")?;
    client.login("admin@example.com", "admin123").await?;

    // Build the Bell state: H on q0, then CNOT(q0 -> q1).
    let mut circuit = Circuit::new(2);
    circuit.h(0).cx(0, 1);

    // Simulate with the statevector engine, sampling 1024 shots.
    let result = client
        .run(&circuit, RunOptions::new().engine(Engine::Statevector).shots(1024))
        .await?;

    let mut counts: Vec<_> = result.counts().iter().collect();
    counts.sort_by_key(|(state, _)| (*state).clone());
    for (state, n) in counts {
        println!("|{state}> : {n}");
    }
    Ok(())
}`}
      />
      <P>Run it and the terminal prints the same two bars the web UI drew:</P>
      <Code
        lang="bash"
        title="output"
        code={`$ cargo run --example bell_state
|00> : 503
|11> : 521
execution time: 0.42 ms`}
      />

      <H3>And from the raw API</H3>
      <P>
        Under both the builder and the SDK is a plain REST endpoint. You can hit it with nothing but{' '}
        <code>curl</code> — every capability in CasimirQ is reachable this way, which is what makes the platform
        scriptable and automatable.
      </P>
      <Code
        lang="bash"
        title="curl"
        code={`curl -X POST http://localhost:8080/api/v1/circuits/simulate \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "circuit": { "qubits": 2, "gates": [
        { "type": "h",  "targets": [0] },
        { "type": "cx", "controls": [0], "targets": [1] }
    ]},
    "engine": "statevector",
    "shots": 1024
  }'`}
      />

      <Callout kind="info" title="One platform, three doors">
        The visual builder, the Rust SDK, and the REST API are three doors into the <em>same</em> simulation
        engine. Learn a circuit once and you can express it whichever way suits the task — click it to explore,
        script it to automate, or POST it to integrate. Part V returns to the SDK and API in depth.
      </Callout>

      <Takeaways
        items={[
          <>The <strong>Circuit Builder</strong> lets you drag gates onto wires and watch qubit count, gate count, and <strong>depth</strong> update live.</>,
          <>Running a circuit <strong>samples shots</strong> and returns a histogram; the Bell state yields clean <M>{'|00\\rangle'}</M> and <M>{'|11\\rangle'}</M> bars.</>,
          <>The same circuit is two lines of Rust (<code>h(0).cx(0,1)</code>) via <code>casq-sdk</code>.</>,
          <>Everything is ultimately a <strong>REST call</strong> — CasimirQ is fully scriptable from any language.</>,
        ]}
      />
    </>
  );
}
