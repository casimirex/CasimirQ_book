import { H2, H3, P, Lead, Callout, PlainEnglish, Takeaways, DataTable, CircuitDiagram, M, Eq } from '../toolkit';

export default function Gates() {
  return (
    <>
      <Lead>
        If a qubit is an arrow on the Bloch sphere, a quantum gate is a rotation of that arrow. Every quantum
        program — from a one-line demo to Shor's algorithm — is just a sequence of these rotations, chosen so
        the arrows end up pointing at the answer. Let's meet the essential ones.
      </Lead>

      <H2>Gates are reversible rotations</H2>
      <P>
        A single-qubit gate is a <M>{'2\\times 2'}</M> matrix that multiplies the state vector. Because a gate
        must preserve total probability (<M>{'|\\alpha|^2+|\\beta|^2=1'}</M>), the matrix has to be{' '}
        <strong>unitary</strong> — its inverse is its conjugate transpose, <M>{'U^\\dagger U = I'}</M>. One
        consequence is profound: <strong>every quantum gate is reversible</strong>. There is no quantum
        “erase.” This is the opposite of classical logic, where an AND gate throws information away.
      </P>

      <Callout kind="info" title="Reversibility, and why measurement is the odd one out">
        Gates are reversible; you can always undo <M>{'U'}</M> by applying <M>{'U^\\dagger'}</M>. The one
        irreversible act in quantum computing is <strong>measurement</strong> — which is exactly why we save it
        for the very end of a circuit.
      </Callout>

      <H2>The Pauli gates: the three axes</H2>
      <P>
        The Pauli gates are half-turns (180°) about the three axes of the Bloch sphere.
      </P>
      <DataTable
        head={['Gate', 'Matrix', 'Effect', 'Bloch']}
        rows={[
          [<M>{'X'}</M>, <M>{'\\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}'}</M>, <>bit-flip: <M>{'|0\\rangle\\leftrightarrow|1\\rangle'}</M></>, 'flip about x'],
          [<M>{'Y'}</M>, <M>{'\\begin{pmatrix}0&-i\\\\i&0\\end{pmatrix}'}</M>, 'bit + phase flip', 'flip about y'],
          [<M>{'Z'}</M>, <M>{'\\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}'}</M>, <>phase-flip: <M>{'|1\\rangle\\to-|1\\rangle'}</M></>, 'flip about z'],
        ]}
      />
      <P>
        <M>{'X'}</M> is the quantum NOT gate — it swaps the amplitudes of <M>{'|0\\rangle'}</M> and{' '}
        <M>{'|1\\rangle'}</M>. <M>{'Z'}</M> leaves probabilities untouched but injects a minus sign onto{' '}
        <M>{'|1\\rangle'}</M>; invisible to a lone measurement, decisive for interference.
      </P>

      <H2>The Hadamard: the bridge to superposition</H2>
      <P>
        We met <M>{'H'}</M> already. Its matrix and its defining property are worth pinning down:
      </P>
      <Eq>{'H = \\tfrac{1}{\\sqrt2}\\begin{pmatrix}1&1\\\\1&-1\\end{pmatrix}, \\qquad H|0\\rangle=|+\\rangle,\\; H|1\\rangle=|-\\rangle'}</Eq>
      <P>
        <M>{'H'}</M> maps the poles of the Bloch sphere to the equator and back. It is its own inverse
        (<M>{'HH=I'}</M>), which is exactly why the double-Hadamard from the last chapter returned to{' '}
        <M>{'|0\\rangle'}</M>.
      </P>

      <H2>Phase gates: S, T, and the fine control</H2>
      <P>
        The <M>{'Z'}</M> gate rotates the phase by a half turn. Its square and fourth roots give finer phase
        control:
      </P>
      <DataTable
        head={['Gate', 'Phase added to |1⟩', 'Relation']}
        rows={[
          [<M>{'Z'}</M>, <M>{'\\pi'}</M>, '—'],
          [<M>{'S'}</M>, <M>{'\\pi/2'}</M>, <M>{'S^2=Z'}</M>],
          [<M>{'T'}</M>, <M>{'\\pi/4'}</M>, <M>{'T^2=S'}</M>],
        ]}
      />
      <P>
        More generally the phase gate <M>{'P(\\lambda)'}</M> adds an arbitrary phase{' '}
        <M>{'e^{i\\lambda}'}</M> to <M>{'|1\\rangle'}</M>. You'll see <M>{'P'}</M> everywhere in the Quantum
        Fourier Transform, where each qubit gets a precisely tuned phase kick.
      </P>
      <Eq>{'P(\\lambda) = \\begin{pmatrix}1&0\\\\0&e^{i\\lambda}\\end{pmatrix}'}</Eq>

      <H3>Rotation gates: any angle you like</H3>
      <P>
        For total freedom, the rotation gates <M>{'R_x(\\theta),\\,R_y(\\theta),\\,R_z(\\theta)'}</M> turn the
        Bloch arrow by any angle <M>{'\\theta'}</M> about the chosen axis. These continuous knobs are the
        lifeblood of variational algorithms like VQE and QAOA, where a classical optimizer nudges the angles to
        minimize an energy.
      </P>
      <Eq>{'R_y(\\theta) = \\begin{pmatrix}\\cos\\tfrac\\theta2 & -\\sin\\tfrac\\theta2\\\\[2pt] \\sin\\tfrac\\theta2 & \\cos\\tfrac\\theta2\\end{pmatrix}'}</Eq>

      <PlainEnglish>
        Think of the Bloch sphere as a globe and your qubit as a compass needle stuck to it. Pauli gates are
        sharp 180° snaps about the three axes. The Hadamard tips the needle from pole to equator. Phase and
        rotation gates are the smooth dials that let you point the needle absolutely anywhere.
      </PlainEnglish>

      <H2>A gate that changes nothing you can measure — until it does</H2>
      <CircuitDiagram
        qubits={['|0⟩']}
        cols={[
          { boxes: [{ wire: 0, label: 'H' }] },
          { boxes: [{ wire: 0, label: 'Z' }] },
          { boxes: [{ wire: 0, label: 'H' }] },
          { measure: [0] },
        ]}
        caption="H · Z · H = X. A phase flip sandwiched between Hadamards becomes a bit flip — measuring gives 1 with certainty."
      />
      <P>
        Run this and you measure <M>{'1'}</M> every time. The middle <M>{'Z'}</M> did nothing to the
        probabilities on its own, yet flanked by Hadamards it turned into a full NOT. That identity —{' '}
        <M>{'HZH = X'}</M> — is a compact proof that phase and amplitude are two views of the same object, and
        that <em>where</em> you place a gate matters as much as <em>which</em> gate it is.
      </P>

      <Callout kind="key" title="Universality">
        You don't need infinitely many gate types. A small set — for instance <M>{'\\{H, T, \\text{CNOT}\\}'}</M>{' '}
        — is <strong>universal</strong>: any quantum computation can be approximated to arbitrary accuracy by
        stringing together enough of them. CasimirQ's builder gives you a rich palette, but under the hood it
        all reduces to a handful of primitives.
      </Callout>

      <Takeaways
        items={[
          <>Gates are <strong>unitary</strong> matrices — reversible rotations of the Bloch arrow.</>,
          <><strong>Pauli</strong> <M>{'X,Y,Z'}</M> are half-turns; <M>{'X'}</M> is NOT, <M>{'Z'}</M> is a phase flip.</>,
          <><strong>Hadamard</strong> bridges poles and equator and is its own inverse.</>,
          <><strong>Phase</strong> (<M>{'S,T,P'}</M>) and <strong>rotation</strong> (<M>{'R_x,R_y,R_z'}</M>) gates give fine, continuous control.</>,
          <>A tiny gate set like <M>{'\\{H,T,\\text{CNOT}\\}'}</M> is <strong>universal</strong> for all of quantum computing.</>,
        ]}
      />
    </>
  );
}
