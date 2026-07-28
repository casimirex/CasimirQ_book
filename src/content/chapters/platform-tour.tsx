import { H2, H3, P, Lead, Callout, Takeaways, Figure, DataTable } from '../toolkit';

export default function PlatformTour() {
  return (
    <>
      <Lead>
        You've built a Bell state three ways. Now let's map the whole workbench. CasimirQ is a full-stack
        quantum platform — a NestJS backend, a React web app, and a Rust SDK — and this short chapter is the
        guided tour so you always know where you are and which tool reaches for which job.
      </Lead>

      <H2>The dashboard: your mission control</H2>
      <P>
        After signing in you land on the <strong>Dashboard</strong>. It's a calm summary of your workspace:
        how many circuits you've built, how many qubits they span, and a list of recent work you can jump back
        into. Think of it as the home base you return to between experiments.
      </P>

      <Figure
        src="/screenshots/dashboard.png"
        alt="The CasimirQ dashboard showing total circuits, total qubits, simulations, and recent circuits."
        caption="The CasimirQ dashboard. Summary tiles up top, recent circuits below, and the full navigation rail on the left."
      />

      <H2>The navigation rail</H2>
      <P>
        Every capability in the platform hangs off the left-hand rail. Here's what each destination is for —
        we'll spend whole chapters inside several of them.
      </P>
      <DataTable
        head={['Section', 'What it does', 'Covered in']}
        rows={[
          ['Dashboard', 'Workspace overview and recent circuits', 'this chapter'],
          ['Circuit Builder', 'Drag-and-drop gate composition + live statevector', 'Chapter 7'],
          ['Simulations', 'Run circuits on the engines, inspect results', 'Chapter 9'],
          ['Jobs', 'History and status of every execution', 'this chapter'],
          ['Noise Lab', 'Add realistic noise channels to a circuit', 'Chapter 10'],
          ['Transpile', 'Rewrite circuits for a target gate set', 'Chapter 10'],
          ['Algorithms', 'Run the 14 built-in quantum algorithms', 'all of Part IV'],
        ]}
      />

      <H2>Jobs: the execution ledger</H2>
      <P>
        Quantum runs — especially long variational loops — are tracked as <strong>jobs</strong>. The Jobs page
        is your audit trail: what ran, when, on which engine, and whether it succeeded. On real hardware, jobs
        queue and take time; even in simulation, the same ledger model keeps your experiments organized and
        reproducible.
      </P>

      <Figure
        src="/screenshots/jobs.png"
        alt="The CasimirQ Jobs page listing execution history and statuses."
        caption="The Jobs ledger. Every simulation and algorithm run is recorded with its status and metadata."
      />

      <Callout kind="idea" title="Why a platform, not just a library?">
        Plenty of libraries can multiply gate matrices. CasimirQ wraps that core in the scaffolding real work
        needs: accounts and auth, saved circuits, a job history, rate limits, noise and transpilation tooling,
        and identical access from a UI, an SDK, and an API. Learning the platform means learning how quantum
        computing is actually <em>operated</em>, not just theorized.
      </Callout>

      <H3>The shape of the stack</H3>
      <P>
        Under the hood, the React app you're clicking through talks to a <strong>NestJS</strong> backend over a
        versioned REST API (<code>/api/v1</code>). The backend owns the simulation engines, the algorithm
        implementations, persistence, and authentication. The <code>casq-sdk</code> Rust crate speaks that same
        API. This clean separation is why every feature is available on every surface — a theme we'll cash in
        during Part V.
      </P>

      <Takeaways
        items={[
          <>The <strong>Dashboard</strong> summarizes your circuits, qubits, and recent work.</>,
          <>The <strong>navigation rail</strong> exposes Circuit Builder, Simulations, Jobs, Noise Lab, Transpile, and Algorithms.</>,
          <><strong>Jobs</strong> form an execution ledger — an audit trail of every run.</>,
          <>A <strong>React UI</strong>, <strong>NestJS API</strong>, and <strong>Rust SDK</strong> share one backend, so every capability appears on every surface.</>,
        ]}
      />
    </>
  );
}
