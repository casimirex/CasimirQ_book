# Mastering Quantum Computing · CasimirQ

An interactive, book-length webapp that takes a reader from *"what on earth is a qubit?"* to running
genuine quantum algorithms — built on and illustrated with the live **CasimirQ** platform.

- **23 chapters**, five parts, novice → professional (including a 53-circuit Circuit Library reference).
- A **turning-universe** Three.js hero (spiral galaxy + a glowing qubit orbited by electrons).
- **KaTeX** math, a custom **SVG circuit renderer**, syntax-highlighted **SDK/API** code.
- **10 real screenshots** of the running CasimirQ app (dashboard, circuit builder, algorithms, a live
  Grover run, Noise Lab, Transpile, Swagger, …) captured from `localhost:8080`.
- Reading progress, chapter search, and per-chapter completion — persisted in `localStorage`.

## The blueprint

| Part | Title | Chapters |
|------|-------|----------|
| I | The Quantum World | Why Quantum · The Qubit & Bloch Sphere · Superposition & Measurement · Entanglement |
| II | The Language of Circuits | Single-Qubit Gates · Multi-Qubit Gates · Building Circuits in CasimirQ · The Circuit Library |
| III | The CasimirQ Platform | A Tour · Simulation Engines · Noise Lab & Transpilation |
| IV | The Algorithm Zoo | Oracles · QFT & QPE · Grover · Shor · Quantum Walks · Hamiltonian Simulation · HHL · VQE & QAOA · Teleportation |
| V | Build Like a Professional | The Rust SDK · The REST API & Swagger · Capstone |

## Run it

```bash
npm install
npm run dev        # dev server at http://localhost:4173
# or
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build
```

Then open <http://localhost:4173>.

## Stack

React 18 · TypeScript · Vite · Tailwind CSS · Three.js (hand-rolled hero + Bloch sphere) · KaTeX ·
highlight.js · framer-motion · react-router.

## How the screenshots were made

The images in `public/screenshots/` are the **live** CasimirQ application, captured with headless Chrome
against the running Docker stack (frontend on `:8080`, API on `:3000/api/v1`). They are not mockups.

---

*Every screenshot is the real app. Every code sample runs against it. Turn the page, turn the universe.*
