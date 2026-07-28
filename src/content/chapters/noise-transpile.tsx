import { H2, H3, P, Lead, Callout, PlainEnglish, Takeaways, Figure, DataTable, CircuitDiagram, M } from '../toolkit';

export default function NoiseTranspile() {
  return (
    <>
      <Lead>
        So far our qubits have been perfect — flawless arrows obeying flawless gates. Real quantum hardware is
        not so kind. This chapter is where the fantasy meets the physics: how noise corrupts a computation, and
        how transpilation rewrites your circuit to survive on an actual device.
      </Lead>

      <H2>Why real qubits misbehave</H2>
      <P>
        A physical qubit is a fragile thing — a superconducting loop, a trapped ion, a photon. It is constantly
        nudged by its environment, and every nudge leaks a little quantum information into the outside world.
        This leak is called <strong>decoherence</strong>, and it is the central engineering challenge of the
        entire field.
      </P>
      <DataTable
        head={['Noise channel', 'What it does', 'Physical cause']}
        rows={[
          ['Bit-flip', <>randomly applies <M>{'X'}</M> — flips <M>{'|0\\rangle\\leftrightarrow|1\\rangle'}</M></>, 'stray excitations'],
          ['Phase-flip', <>randomly applies <M>{'Z'}</M> — scrambles the phase</>, 'fluctuating fields'],
          ['Amplitude damping', <>decays <M>{'|1\\rangle\\to|0\\rangle'}</M></>, 'energy loss (T1)'],
          ['Depolarizing', 'replaces the state with random noise with some probability', 'catch-all model'],
        ]}
      />

      <PlainEnglish>
        Imagine writing a message on the surface of a pond. In still water it lasts a moment; in a breeze it
        smears instantly. Qubits are messages on that pond, and the environment is always breathing on it.
        Every gate you apply is a race against the ripples.
      </PlainEnglish>

      <H2>The Noise Lab</H2>
      <P>
        CasimirQ's <strong>Noise Lab</strong> lets you switch off the fantasy and watch a circuit degrade under
        realistic noise. Take the Bell state, add a depolarizing channel, and the once-clean{' '}
        <M>{'|00\\rangle'}</M>/<M>{'|11\\rangle'}</M> histogram grows spurious <M>{'|01\\rangle'}</M> and{' '}
        <M>{'|10\\rangle'}</M> bars — the very outcomes that were forbidden in the ideal case. Turn the noise up
        and the signal drowns entirely.
      </P>

      <Figure
        src="/screenshots/noise-lab.png"
        alt="The CasimirQ Noise Lab, where noise channels are added to a circuit and their effect observed."
        caption="The Noise Lab. Configure noise channels and strengths, then compare the noisy result against the ideal one."
      />

      <Callout kind="idea" title="This is why error correction exists">
        Because noise is relentless, real quantum computers spend most of their qubits protecting a few. A
        <strong> logical qubit</strong> is encoded across many physical qubits so that errors can be detected
        and reversed faster than they accumulate. The Noise Lab gives you a visceral feel for the enemy that
        error correction was invented to fight.
      </Callout>

      <H2>Transpilation: speaking the hardware's language</H2>
      <P>
        Here's a second reality check: no real device implements every gate in the textbook. Each hardware
        family has its own small <strong>native gate set</strong> and its own map of which qubits can directly
        interact. Your beautiful circuit, full of Toffolis and long-range CNOTs, has to be{' '}
        <strong>transpiled</strong> — rewritten into equivalent native operations the machine can actually run.
      </P>
      <P>Transpilation does three jobs:</P>
      <P>
        <strong>Decompose</strong> gates the device lacks into ones it has (a Toffoli becomes several CNOTs and
        single-qubit gates). <strong>Route</strong> qubits so that any two that must interact are physically
        adjacent, inserting SWAPs where needed. <strong>Optimize</strong> the result — cancel redundant gates,
        merge rotations — to keep the circuit as shallow as possible, because depth is decoherence.
      </P>

      <CircuitDiagram
        qubits={['a', 'b', 'target']}
        cols={[
          { boxes: [{ wire: 2, label: 'H' }] },
          { ctrl: { controls: [1], target: 2, kind: 'x' } },
          { boxes: [{ wire: 2, label: 'T†', family: 'phase' }] },
          { ctrl: { controls: [0], target: 2, kind: 'x' } },
          { boxes: [{ wire: 2, label: 'T', family: 'phase' }] },
          { ctrl: { controls: [1], target: 2, kind: 'x' } },
          { boxes: [{ wire: 2, label: '…', family: 'phase' }] },
        ]}
        caption="A glimpse of transpilation: one Toffoli unfolds into a sequence of CNOTs, T, and T† gates — the form real hardware can execute."
      />

      <Figure
        src="/screenshots/transpile.png"
        alt="The CasimirQ Transpile page showing a circuit rewritten for a target gate set."
        caption="The Transpile workspace. Choose a target basis and CasimirQ rewrites your circuit into equivalent native gates."
      />

      <H3>Depth is the enemy</H3>
      <P>
        Every extra layer of gates is extra time for noise to act. That's why the optimizer fights so hard to
        reduce depth, and why an algorithm that looks elegant on paper may need serious surgery to run on
        today's <strong>NISQ</strong> (Noisy Intermediate-Scale Quantum) devices. Understanding this trade-off
        is what separates a textbook exercise from a circuit that actually produces a usable answer.
      </P>

      <Takeaways
        items={[
          <><strong>Decoherence</strong> — bit-flip, phase-flip, damping, depolarizing — corrupts real qubits continuously.</>,
          <>The <strong>Noise Lab</strong> shows a Bell state's forbidden outcomes appearing as noise rises.</>,
          <><strong>Transpilation</strong> rewrites a circuit into a device's native gates, routes qubits, and minimizes depth.</>,
          <><strong>Depth is decoherence</strong>: shallower circuits survive noise better — the core constraint of the NISQ era.</>,
        ]}
      />
    </>
  );
}
