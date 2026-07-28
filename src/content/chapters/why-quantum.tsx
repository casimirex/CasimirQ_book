import { H2, P, Lead, Callout, PlainEnglish, Takeaways, Versus, M, Eq } from '../toolkit';

export default function WhyQuantum() {
  return (
    <>
      <Lead>
        Imagine you are standing at the entrance of an enormous maze. A normal computer explores it the way
        you would: one corridor at a time, backtracking whenever it hits a dead end. A quantum computer does
        something that sounds like science fiction — it walks <em>every</em> corridor at once, lets the wrong
        paths cancel each other out like ripples on a pond, and arrives at the exit with startling speed. This
        book is about how that trick works, and how you can run it yourself on <strong>CasimirQ</strong>.
      </Lead>

      <H2>The itch that classical computers can't scratch</H2>
      <P>
        The device you are reading this on is a masterpiece of classical engineering. It shuffles billions of
        bits per second, and each bit is rigidly one of two things: <M>{'0'}</M> or <M>{'1'}</M>. That
        simplicity is its strength — and its ceiling. Some problems grow so fast that no amount of classical
        speed can keep up.
      </P>
      <P>
        Take factoring a number into its prime pieces. Multiplying two 300-digit primes is instant. Going
        backwards — recovering the primes from the product — would take the fastest supercomputers longer than
        the age of the universe. The entire security of the internet leans on that asymmetry. Or take
        chemistry: to simulate a modest molecule exactly, the number of classical variables doubles with every
        electron you add. Nature, it turns out, is running a computation that our machines fundamentally
        struggle to imitate.
      </P>

      <Callout kind="idea" title="Why does nature seem 'expensive' to simulate?">
        Because reality at small scales does not behave like bits. An electron isn't simply “here” or “there” —
        it carries a spread of possibilities that interfere with one another. To track that faithfully on a
        classical computer, you need to store every possibility at once, and there are exponentially many.
      </Callout>

      <H2>The three ingredients of quantum advantage</H2>
      <P>
        Quantum computing does not run classical programs faster. It plays a different game, using three
        phenomena that have no classical counterpart. We will spend the next three chapters on each; here is
        the aerial view.
      </P>

      <P>
        <strong>1. Superposition.</strong> A quantum bit — a <em>qubit</em> — can be a blend of{' '}
        <M>{'0'}</M> and <M>{'1'}</M> at the same time, written{' '}
        <M>{'\\alpha|0\\rangle + \\beta|1\\rangle'}</M>. With <M>{'n'}</M> qubits you hold{' '}
        <M>{'2^n'}</M> possibilities simultaneously. Thirty qubits already span more than a billion states.
      </P>
      <P>
        <strong>2. Interference.</strong> Those possibilities carry a phase — like the crest or trough of a
        wave. A well-designed algorithm arranges for the <em>wrong</em> answers to cancel and the{' '}
        <em>right</em> answers to reinforce. This is the real engine of quantum speedups, and the part
        beginners most often miss.
      </P>
      <P>
        <strong>3. Entanglement.</strong> Qubits can become linked so that measuring one instantly tells you
        about another, no matter the distance. Einstein called it “spooky action at a distance.” It is the glue
        that lets many qubits behave as one correlated whole.
      </P>

      <PlainEnglish>
        A classical computer is a diligent librarian checking books one by one. A quantum computer is a hall of
        whispering echoes: it sends a question rippling through every book at once and listens for the echoes
        that survive. Superposition creates the echoes, interference decides which ones survive, and
        entanglement keeps them in tune.
      </PlainEnglish>

      <H2>A tiny taste of the magic: interference</H2>
      <P>
        Here is the single most important sentence in this whole book:{' '}
        <strong>amplitudes can be negative, and negative things can cancel.</strong> Probabilities in the
        everyday world are always positive, so they only ever add up. Quantum amplitudes are different — they
        behave like signed numbers (in fact, complex numbers). When two paths lead to the same wrong answer
        with opposite signs, they annihilate:
      </P>
      <Eq>{'\\tfrac{1}{2}\\,\\underbrace{(+1)}_{\\text{path A}} \\;+\\; \\tfrac{1}{2}\\,\\underbrace{(-1)}_{\\text{path B}} \\;=\\; 0'}</Eq>
      <P>
        That zero is the sound of a wrong answer being erased. Every quantum algorithm in this book — Grover's
        search, Shor's factoring, phase estimation — is ultimately a clever choreography of amplitudes so that
        the answers you don't want interfere <em>destructively</em> and the one you do want interferes{' '}
        <em>constructively</em>.
      </P>

      <H2>Classical vs quantum, at a glance</H2>
      <Versus
        left={{
          title: 'Classical bit',
          points: [
            <>Is exactly <M>{'0'}</M> or <M>{'1'}</M> at all times.</>,
            <><M>{'n'}</M> bits describe one of <M>{'2^n'}</M> states.</>,
            'Copyable, readable, deterministic.',
            'Probabilities only ever add (all positive).',
          ],
        }}
        right={{
          title: 'Quantum qubit',
          points: [
            <>Is a blend <M>{'\\alpha|0\\rangle+\\beta|1\\rangle'}</M>.</>,
            <><M>{'n'}</M> qubits hold all <M>{'2^n'}</M> amplitudes at once.</>,
            'Cannot be copied; measuring disturbs it.',
            'Amplitudes can cancel — interference is the point.',
          ],
        }}
      />

      <Callout kind="warn" title="Quantum computers are not just 'faster computers'">
        A quantum computer will not open your spreadsheets faster or render video quicker. Its advantage is
        narrow but deep: a handful of problem shapes — factoring, search, simulation of quantum systems,
        certain optimization and linear-algebra tasks — where interference buys a genuine, provable speedup.
        For everything else, your laptop wins.
      </Callout>

      <H2>Where CasimirQ comes in</H2>
      <P>
        Reading about superposition is like reading about swimming. At some point you have to get in the water.
        <strong> CasimirQ</strong> is the pool. It is a complete quantum computing platform with three ways to
        touch every idea in this book:
      </P>
      <P>
        A <strong>web application</strong> where you drag gates onto wires and watch the statevector evolve; a
        <strong> Rust SDK</strong> (<code>casq-sdk</code>) so you can script quantum programs from real code;
        and a <strong>REST API</strong> with interactive Swagger docs. The same 14 algorithms are available on
        all three. Throughout this book, every screenshot is the live application, and every code sample runs
        against it.
      </P>

      <Takeaways
        items={[
          <>Quantum computers win on a <strong>narrow set of problems</strong> by exploiting phenomena classical machines can't reproduce.</>,
          <>The three pillars are <strong>superposition</strong> (many states at once), <strong>interference</strong> (amplitudes that cancel), and <strong>entanglement</strong> (linked qubits).</>,
          <>The secret sauce is <strong>interference</strong>: engineering wrong answers to cancel and right answers to survive.</>,
          <>You'll learn every idea hands-on through the <strong>CasimirQ</strong> web app, Rust SDK, and REST API.</>,
        ]}
      />
    </>
  );
}
