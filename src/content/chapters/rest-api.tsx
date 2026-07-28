import { H2, H3, P, Lead, Callout, Takeaways, Figure, Code, DataTable } from '../toolkit';

export default function RestApi() {
  return (
    <>
      <Lead>
        Beneath the web app and the SDK is a single source of truth: a versioned REST API. Every button you've
        clicked and every SDK method you've called ultimately becomes an HTTP request to it. Learn the API and
        you can wire CasimirQ into any language, any pipeline, any tool that speaks HTTP.
      </Lead>

      <H2>One backend, three front doors</H2>
      <P>
        The React UI, the Rust SDK, and your <code>curl</code> commands all hit the same NestJS backend at{' '}
        <code>/api/v1</code>. There's no “UI-only” feature and no “SDK-only” trick — the API <em>is</em> the
        platform, and the other surfaces are conveniences on top of it. That's what guarantees consistency: fix
        a bug once and all three benefit.
      </P>

      <H2>Authentication: get a token</H2>
      <P>
        Access is gated by JSON Web Tokens. Post your credentials to the login endpoint and you receive a
        bearer token to attach to every subsequent request.
      </P>
      <Code
        lang="bash"
        title="login"
        code={`# Exchange credentials for a JWT.
TOKEN=$(curl -s -X POST http://localhost:8080/api/v1/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"admin@example.com","password":"admin123"}' \\
  | jq -r .access_token)

# Attach it to protected calls.
curl -s http://localhost:8080/api/v1/algorithms \\
  -H "Authorization: Bearer $TOKEN" | jq .count   # -> 14`}
      />

      <H2>The endpoint map</H2>
      <P>
        The API is organized by resource. Here are the groups you'll use most; each algorithm from Part IV has
        its own <code>POST</code> endpoint under <code>/algorithms</code>.
      </P>
      <DataTable
        head={['Method & path', 'Purpose']}
        rows={[
          [<code>POST /auth/login</code>, 'Authenticate, receive a JWT'],
          [<code>POST /circuits/simulate</code>, 'Run a circuit on an engine'],
          [<code>GET /algorithms</code>, 'List the 14 built-in algorithms'],
          [<code>POST /algorithms/grover</code>, "Run Grover's search"],
          [<code>POST /algorithms/shor</code>, 'Factor via quantum order finding'],
          [<code>POST /algorithms/hhl</code>, 'Solve a linear system'],
          [<code>GET /jobs</code>, 'List execution history'],
        ]}
      />
      <Code
        lang="bash"
        title="run an algorithm"
        code={`# Factor 15 straight from the API.
curl -s -X POST http://localhost:8080/api/v1/algorithms/shor \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"number": 15}' | jq '{factors, period, base}'

# => { "factors": [3, 5], "period": 4, "base": 7 }`}
      />

      <H2>Swagger: the API explores itself</H2>
      <P>
        You don't have to memorize any of this. The backend serves interactive <strong>Swagger</strong>{' '}
        documentation at <code>/api/v1/docs</code>: every endpoint, its request and response schema, and a
        “Try it out” button that fires live calls from your browser. It's generated from the same DTOs the
        server validates against, so it never drifts out of date.
      </P>
      <Figure
        src="/screenshots/swagger.png"
        alt="The CasimirQ interactive Swagger API documentation listing endpoints and schemas."
        caption="The interactive Swagger docs at /api/v1/docs. Browse every endpoint, inspect schemas, and execute live requests without leaving the page."
      />

      <Callout kind="key" title="The contract loop">
        The server publishes an <strong>OpenAPI</strong> specification describing every endpoint. The SDK
        vendors a copy and tests against it; the Swagger UI renders it; the frontend's types are derived from
        it. This single contract is why “every capability on every surface” is a guarantee, not a slogan —
        add an endpoint and the spec, the docs, and the SDK's contract test all move together.
      </Callout>

      <H3>Guardrails</H3>
      <P>
        Because the API is public-facing, it's protected: JWT auth on every sensitive route, rate limiting to
        prevent abuse, and validation on every request body (out-of-range qubit counts or malformed circuits
        are rejected with a clear <code>400</code>). These are the unglamorous features that turn a demo into a
        platform you can actually operate.
      </P>

      <Takeaways
        items={[
          <>The <strong>REST API</strong> at <code>/api/v1</code> is the single backend behind the UI and SDK.</>,
          <>Authenticate via <code>POST /auth/login</code> and attach the <strong>JWT</strong> as a bearer token.</>,
          <>Each algorithm has its own <code>POST /algorithms/&lt;name&gt;</code> endpoint returning JSON.</>,
          <><strong>Swagger</strong> at <code>/api/v1/docs</code> is live, self-documenting, and generated from the server's DTOs.</>,
          <>An <strong>OpenAPI contract</strong> keeps the API, docs, and SDK in lockstep; auth, rate limits, and validation guard it.</>,
        ]}
      />
    </>
  );
}
