import type { ComponentType } from 'react';
import {
  Atom, Circle, Waves, Link2, SlidersHorizontal, Network, Blocks,
  LayoutDashboard, Cpu, Activity, KeyRound, Sigma, Search, Lock,
  Footprints, Clock, Calculator, GitBranch, Send, Boxes, Server, Trophy,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Chapters (each default-exports its content component).
import WhyQuantum from './chapters/why-quantum';
import TheQubit from './chapters/the-qubit';
import Superposition from './chapters/superposition';
import Entanglement from './chapters/entanglement';
import Gates from './chapters/gates';
import MultiQubit from './chapters/multi-qubit';
import CircuitsInCasimirQ from './chapters/circuits-in-casimirq';
import PlatformTour from './chapters/platform-tour';
import Engines from './chapters/engines';
import NoiseTranspile from './chapters/noise-transpile';
import Oracles from './chapters/oracles';
import QftQpe from './chapters/qft-qpe';
import Grover from './chapters/grover';
import Shor from './chapters/shor';
import QuantumWalks from './chapters/quantum-walks';
import Hamiltonian from './chapters/hamiltonian';
import Hhl from './chapters/hhl';
import Variational from './chapters/variational';
import Teleportation from './chapters/teleportation';
import Sdk from './chapters/sdk';
import RestApi from './chapters/rest-api';
import Capstone from './chapters/capstone';

export interface Chapter {
  slug: string;
  number: number;
  part: number;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  minutes: number;
  Component: ComponentType;
}

export const PARTS = [
  { id: 1, title: 'The Quantum World', tag: 'For the curious mind' },
  { id: 2, title: 'The Language of Circuits', tag: 'Gates, wires & logic' },
  { id: 3, title: 'The CasimirQ Platform', tag: 'Your quantum workbench' },
  { id: 4, title: 'The Algorithm Zoo', tag: 'A → Z of quantum power' },
  { id: 5, title: 'Build Like a Professional', tag: 'SDK, API & capstone' },
] as const;

const raw: Omit<Chapter, 'number'>[] = [
  { slug: 'why-quantum', part: 1, title: 'Why Quantum?', subtitle: 'A new way the universe computes', icon: Atom, minutes: 12, Component: WhyQuantum },
  { slug: 'the-qubit', part: 1, title: 'The Qubit & the Bloch Sphere', subtitle: 'From bits to spheres of possibility', icon: Circle, minutes: 14, Component: TheQubit },
  { slug: 'superposition', part: 1, title: 'Superposition & Measurement', subtitle: 'Being many things at once', icon: Waves, minutes: 13, Component: Superposition },
  { slug: 'entanglement', part: 1, title: 'Entanglement', subtitle: 'The quantum handshake', icon: Link2, minutes: 13, Component: Entanglement },

  { slug: 'gates', part: 2, title: 'Single-Qubit Gates', subtitle: 'Rotating the sphere', icon: SlidersHorizontal, minutes: 15, Component: Gates },
  { slug: 'multi-qubit', part: 2, title: 'Multi-Qubit Gates', subtitle: 'CNOT, control & the circuit model', icon: Network, minutes: 14, Component: MultiQubit },
  { slug: 'circuits-in-casimirq', part: 2, title: 'Building Circuits in CasimirQ', subtitle: 'Your first Bell state', icon: Blocks, minutes: 12, Component: CircuitsInCasimirQ },

  { slug: 'platform-tour', part: 3, title: 'A Tour of CasimirQ', subtitle: 'Dashboard to jobs', icon: LayoutDashboard, minutes: 10, Component: PlatformTour },
  { slug: 'engines', part: 3, title: 'Simulation Engines', subtitle: 'How the state is computed', icon: Cpu, minutes: 12, Component: Engines },
  { slug: 'noise-transpile', part: 3, title: 'Noise Lab & Transpilation', subtitle: 'Toward real hardware', icon: Activity, minutes: 12, Component: NoiseTranspile },

  { slug: 'oracles', part: 4, title: 'Oracle Algorithms', subtitle: 'Deutsch-Jozsa, Bernstein-Vazirani, Simon', icon: KeyRound, minutes: 16, Component: Oracles },
  { slug: 'qft-qpe', part: 4, title: 'QFT & Phase Estimation', subtitle: 'The Fourier heart of quantum', icon: Sigma, minutes: 16, Component: QftQpe },
  { slug: 'grover', part: 4, title: 'Grover & Amplitude Amplification', subtitle: 'Searching a haystack fast', icon: Search, minutes: 15, Component: Grover },
  { slug: 'shor', part: 4, title: "Shor's Algorithm", subtitle: 'Breaking RSA with order finding', icon: Lock, minutes: 18, Component: Shor },
  { slug: 'quantum-walks', part: 4, title: 'Quantum Walks', subtitle: 'Random walks, reimagined', icon: Footprints, minutes: 12, Component: QuantumWalks },
  { slug: 'hamiltonian', part: 4, title: 'Hamiltonian Simulation', subtitle: 'Simulating nature itself', icon: Clock, minutes: 14, Component: Hamiltonian },
  { slug: 'hhl', part: 4, title: 'HHL: Linear Systems', subtitle: 'Solving Ax = b on a qubit', icon: Calculator, minutes: 14, Component: Hhl },
  { slug: 'variational', part: 4, title: 'Variational: VQE & QAOA', subtitle: 'Quantum meets machine learning', icon: GitBranch, minutes: 16, Component: Variational },
  { slug: 'teleportation', part: 4, title: 'Quantum Teleportation', subtitle: 'Moving a state with entanglement', icon: Send, minutes: 11, Component: Teleportation },

  { slug: 'sdk', part: 5, title: 'The Rust SDK', subtitle: 'casq-sdk: quantum in your code', icon: Boxes, minutes: 14, Component: Sdk },
  { slug: 'rest-api', part: 5, title: 'The REST API & Swagger', subtitle: 'Every capability over HTTP', icon: Server, minutes: 11, Component: RestApi },
  { slug: 'capstone', part: 5, title: 'Capstone Project', subtitle: 'From novice to professional', icon: Trophy, minutes: 15, Component: Capstone },
];

export const CHAPTERS: Chapter[] = raw.map((c, i) => ({ ...c, number: i + 1 }));

export const chapterBySlug = (s: string) => CHAPTERS.find((c) => c.slug === s);
export const chapterIndex = (s: string) => CHAPTERS.findIndex((c) => c.slug === s);
export const partChapters = (part: number) => CHAPTERS.filter((c) => c.part === part);
