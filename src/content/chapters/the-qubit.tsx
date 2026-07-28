import { H2, H3, P, Lead, Callout, PlainEnglish, Takeaways, DataTable, M, Eq, BlochSphere } from '../toolkit';

export default function TheQubit() {
  return (
    <>
      <Lead>
        A classical bit is a coin lying flat on a table: heads or tails. A qubit is a coin spinning in the air —
        not heads, not tails, but a living blend of both, described by a point on the surface of a sphere. Meet
        the fundamental unit of quantum information.
      </Lead>

      <H2>From bits to state vectors</H2>
      <P>
        We write the two definite states of a qubit using <em>Dirac notation</em>, those angular brackets you'll
        see everywhere: <M>{'|0\\rangle'}</M> (“ket zero”) and <M>{'|1\\rangle'}</M> (“ket one”). Think of them
        as two arrows pointing in perpendicular directions. Concretely they are column vectors:
      </P>
      <Eq>{'|0\\rangle = \\begin{pmatrix}1\\\\0\\end{pmatrix}, \\qquad |1\\rangle = \\begin{pmatrix}0\\\\1\\end{pmatrix}'}</Eq>
      <P>
        A general qubit state <M>{'|\\psi\\rangle'}</M> is any weighted combination of the two — a{' '}
        <strong>superposition</strong>:
      </P>
      <Eq label="the qubit">{'|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle = \\begin{pmatrix}\\alpha\\\\\\beta\\end{pmatrix}'}</Eq>
      <P>
        The numbers <M>{'\\alpha'}</M> and <M>{'\\beta'}</M> are <em>amplitudes</em> — complex numbers, not
        ordinary probabilities. They are the reason quantum computing works, so they deserve a careful look.
      </P>

      <H2>The Born rule: from amplitudes to what you see</H2>
      <P>
        You can never observe <M>{'\\alpha'}</M> and <M>{'\\beta'}</M> directly. The moment you{' '}
        <em>measure</em> a qubit, it snaps to <M>{'0'}</M> or <M>{'1'}</M>. The probability of each outcome is
        the amplitude's magnitude, squared — the famous <strong>Born rule</strong>:
      </P>
      <Eq>{'P(0) = |\\alpha|^2, \\qquad P(1) = |\\beta|^2'}</Eq>
      <P>
        Because the qubit must land <em>somewhere</em>, those probabilities add to one. This is the{' '}
        <strong>normalization</strong> condition, and every valid qubit state obeys it:
      </P>
      <Eq>{'|\\alpha|^2 + |\\beta|^2 = 1'}</Eq>

      <Callout kind="idea" title="Why squared?">
        Amplitudes behave like the height of a wave; the thing you actually detect — intensity, probability —
        goes as the square of the height. Squaring is also what lets negative amplitudes matter:{' '}
        <M>{'(+\\tfrac{1}{\\sqrt2})^2'}</M> and <M>{'(-\\tfrac{1}{\\sqrt2})^2'}</M> give the same probability,
        yet the two states are physically different and interfere differently.
      </Callout>

      <H3>A worked example</H3>
      <P>
        Consider the state <M>{'|\\psi\\rangle = \\tfrac{1}{2}|0\\rangle + \\tfrac{\\sqrt3}{2}|1\\rangle'}</M>.
        Then <M>{'P(0) = (\\tfrac12)^2 = \\tfrac14'}</M> and <M>{'P(1) = (\\tfrac{\\sqrt3}{2})^2 = \\tfrac34'}</M>.
        Measure a thousand identically-prepared copies and you'll see roughly 250 zeros and 750 ones. Notice
        the amplitudes checked out: <M>{'\\tfrac14 + \\tfrac34 = 1'}</M>.
      </P>

      <H2>The Bloch sphere: a qubit you can see</H2>
      <P>
        Two complex numbers constrained by normalization leave exactly two real degrees of freedom. That means
        every pure qubit state can be drawn as a point on the surface of a sphere — the{' '}
        <strong>Bloch sphere</strong>. This is the single most useful picture in quantum computing. Drag your
        eyes over the one below: the north pole is <M>{'|0\\rangle'}</M>, the south pole is{' '}
        <M>{'|1\\rangle'}</M>, and everything else is a superposition.
      </P>

      <BlochSphere theta={Math.PI / 2.6} phi={0.6} label="|ψ⟩ = α|0⟩ + β|1⟩" />

      <P>
        Any state is fixed by two angles, exactly like latitude and longitude on Earth:
      </P>
      <Eq>{'|\\psi\\rangle = \\cos\\tfrac{\\theta}{2}\\,|0\\rangle + e^{i\\varphi}\\sin\\tfrac{\\theta}{2}\\,|1\\rangle'}</Eq>
      <DataTable
        head={['Symbol', 'Meaning', 'Controls']}
        rows={[
          [<M>{'\\theta'}</M>, 'Polar angle (0 at north pole, π at south)', <>the <strong>balance</strong> between <M>{'|0\\rangle'}</M> and <M>{'|1\\rangle'}</M></>],
          [<M>{'\\varphi'}</M>, 'Azimuthal angle around the equator', <>the <strong>phase</strong> — invisible to a single measurement, decisive for interference</>],
        ]}
      />

      <Callout kind="key" title="Phase is real, even when it's invisible">
        The two equator states <M>{'|+\\rangle=\\tfrac{1}{\\sqrt2}(|0\\rangle+|1\\rangle)'}</M> and{' '}
        <M>{'|-\\rangle=\\tfrac{1}{\\sqrt2}(|0\\rangle-|1\\rangle)'}</M> give <em>identical</em> 50/50
        measurement statistics. Yet they sit on opposite sides of the sphere and behave completely differently
        once more gates act on them. Ignoring phase is the #1 way beginners lose the plot.
      </Callout>

      <PlainEnglish>
        A qubit is an arrow pointing somewhere on a globe. How far it tilts from the north pole sets the odds of
        measuring 0 versus 1. Which way it points around the equator is a hidden compass bearing — you can't
        read it off a single measurement, but it steers how the arrow combines with others.
      </PlainEnglish>

      <H2>Two qubits, and the exponential blowup</H2>
      <P>
        Put two qubits together and the state space is the four combinations{' '}
        <M>{'|00\\rangle, |01\\rangle, |10\\rangle, |11\\rangle'}</M>, each with its own amplitude:
      </P>
      <Eq>{'|\\psi\\rangle = \\alpha_{00}|00\\rangle + \\alpha_{01}|01\\rangle + \\alpha_{10}|10\\rangle + \\alpha_{11}|11\\rangle'}</Eq>
      <P>
        Three qubits give eight amplitudes, ten give 1024, and <M>{'n'}</M> qubits give{' '}
        <M>{'2^n'}</M>. This exponential is the prize and the peril: it's why a quantum computer can hold
        astronomically many possibilities, and also why simulating one on a classical machine gets so
        expensive. CasimirQ's statevector engine stores exactly these <M>{'2^n'}</M> complex amplitudes and
        evolves them gate by gate — which is why simulations are capped at a modest number of qubits.
      </P>

      <Takeaways
        items={[
          <>A qubit is a vector <M>{'\\alpha|0\\rangle+\\beta|1\\rangle'}</M> with <M>{'|\\alpha|^2+|\\beta|^2=1'}</M>.</>,
          <>Measurement is probabilistic (<strong>Born rule</strong>): outcome <M>{'k'}</M> appears with probability <M>{'|\\alpha_k|^2'}</M>.</>,
          <>The <strong>Bloch sphere</strong> turns a qubit into a point on a globe, set by a balance angle <M>{'\\theta'}</M> and a phase <M>{'\\varphi'}</M>.</>,
          <><strong>Phase</strong> is invisible to a lone measurement but drives all interference — never neglect it.</>,
          <><M>{'n'}</M> qubits carry <M>{'2^n'}</M> amplitudes: exponential power, exponential simulation cost.</>,
        ]}
      />
    </>
  );
}
