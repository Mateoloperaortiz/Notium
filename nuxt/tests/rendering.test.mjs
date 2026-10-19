import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { readdir, readFile } from 'node:fs/promises';
import { createServer } from 'node:net';
import { join, relative } from 'node:path';
import test from 'node:test';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

const projectDirectory = fileURLToPath(new URL('..', import.meta.url));
const publicDirectory = join(projectDirectory, '.output/public');
const posts = [
  {
    slug: 'entender-promedio-ponderado',
    title: 'Cómo interpretar tu promedio ponderado',
    section: 'Promedio evaluado y aporte acumulado',
    content: 'La nota final es 3,3 sobre 5,0.',
  },
  {
    slug: 'planear-evaluaciones-semestre',
    title: 'Planea tus evaluaciones durante el semestre',
    section: 'Actualiza el plan con resultados reales',
    content: 'Después de cada evaluación, registra la nota obtenida y revisa tu avance.',
  },
  {
    slug: 'leer-dashboard-academico',
    title: 'Lee tu dashboard académico con contexto',
    section: 'Pasa de la gráfica a una acción',
    content: 'El promedio simple sería 3,5.',
  },
];
const subjects = [
  {
    id: 1,
    semesterId: 1,
    code: 'ISAW-01',
    name: 'Ingeniería de Software para Aplicaciones Web',
    credits: 3,
    professor: 'Daniel Correa',
  },
  {
    id: 2,
    semesterId: 1,
    code: 'DAW-01',
    name: 'Desarrollo de Aplicaciones Web',
    credits: 3,
    professor: 'Laura Gómez',
  },
  {
    id: 3,
    semesterId: 2,
    code: 'FAA-01',
    name: 'Fundamentos de Aprendizaje Automático',
    credits: 3,
    professor: 'Andrés Rojas',
  },
];

function visibleText(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&(?:nbsp|#160);/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function headingText(html) {
  const heading = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  assert.ok(heading, 'The initial HTML must contain an h1 heading.');
  return visibleText(heading[1]);
}

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const children = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? htmlFiles(path) : path.endsWith('.html') ? [path] : [];
    }),
  );
  return children.flat();
}

async function availablePort() {
  const listener = createServer();
  listener.listen(0, '127.0.0.1');
  await once(listener, 'listening');
  const address = listener.address();
  assert.ok(address && typeof address === 'object');
  await new Promise((resolve, reject) => {
    listener.close((error) => (error ? reject(error) : resolve()));
  });
  return address.port;
}

async function stopServer(server) {
  if (!server.pid || server.exitCode !== null || server.signalCode !== null) {
    return;
  }

  const exited = once(server, 'exit');
  server.kill('SIGTERM');
  let timeout;
  try {
    await Promise.race([
      exited,
      new Promise((resolve) => {
        timeout = setTimeout(() => {
          server.kill('SIGKILL');
          resolve();
        }, 3000);
      }),
    ]);
    await exited;
  } finally {
    clearTimeout(timeout);
  }
}

test('the production build preserves SSG, SSR, CSR and API behavior', async (suite) => {
  const port = await availablePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const server = spawn(process.execPath, ['.output/server/index.mjs'], {
    cwd: projectDirectory,
    env: {
      ...process.env,
      HOST: '127.0.0.1',
      NITRO_HOST: '127.0.0.1',
      NODE_ENV: 'production',
      PORT: String(port),
      NITRO_PORT: String(port),
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let serverOutput = '';
  let spawnError;
  for (const stream of [server.stdout, server.stderr]) {
    stream.on('data', (chunk) => {
      serverOutput = (serverOutput + chunk.toString()).slice(-16000);
    });
  }
  server.on('error', (error) => {
    spawnError = error;
  });
  suite.after(() => stopServer(server));

  const deadline = Date.now() + 15000;
  let ready = false;
  while (Date.now() < deadline) {
    if (spawnError || server.exitCode !== null || server.signalCode !== null) {
      assert.fail(`The production server could not start: ${spawnError ?? serverOutput}`);
    }
    try {
      const response = await fetch(`${baseUrl}/api/subjects`, {
        signal: AbortSignal.timeout(1000),
      });
      if (response.ok) {
        await response.arrayBuffer();
        ready = true;
        break;
      }
      await response.arrayBuffer();
    } catch {
      await delay(100);
    }
  }
  assert.ok(ready, `The production server was not ready after 15 seconds.\n${serverOutput}`);

  async function get(path) {
    return fetch(`${baseUrl}${path}`, { signal: AbortSignal.timeout(5000) });
  }

  await suite.test('SSG generates the blog index and all three complete articles', async () => {
    const index = await readFile(join(publicDirectory, 'blog/index.html'), 'utf8');
    assert.equal(headingText(index), 'Blog académico');

    for (const post of posts) {
      assert.ok(visibleText(index).includes(post.title), `The index must list ${post.title}.`);
      assert.ok(index.includes(`/blog/${post.slug}`), 'Each title must link to its article.');
      const path = `/blog/${post.slug}`;
      const staticHtml = await readFile(join(publicDirectory, path, 'index.html'), 'utf8');
      assert.equal(headingText(staticHtml), post.title);
      assert.ok(
        visibleText(staticHtml).includes(post.section),
        'The article must include sections.',
      );
      assert.ok(
        visibleText(staticHtml).includes(post.content),
        'The full article must be rendered.',
      );

      const response = await get(path);
      assert.equal(response.status, 200, path);
      assert.equal(headingText(await response.text()), post.title);
    }

    const response = await get('/blog');
    assert.equal(response.status, 200);
    assert.equal(headingText(await response.text()), 'Blog académico');
  });

  await suite.test('SSR and CSR pages are not generated as static HTML', async () => {
    const generated = (await htmlFiles(publicDirectory)).map((path) =>
      relative(publicDirectory, path).replaceAll('\\', '/'),
    );
    assert.deepEqual(
      generated.filter((path) => /^(subjects|tools)(?:\/|\.html$)/.test(path)),
      [],
      'Only the blog section should be prerendered.',
    );
    assert.deepEqual(
      generated.filter((path) => path.startsWith('blog/')).sort(),
      ['blog/index.html', ...posts.map((post) => `blog/${post.slug}/index.html`)].sort(),
    );
  });

  await suite.test('the API serves the three typed subjects and consistent details', async () => {
    const response = await get('/api/subjects');
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type') ?? '', /application\/json/);
    const actual = await response.json();
    assert.ok(Array.isArray(actual));
    assert.equal(actual.length, subjects.length);

    for (const expected of subjects) {
      const subject = actual.find((item) => item.id === expected.id);
      assert.ok(subject, `Subject ${expected.id} must exist.`);
      const { createdAt, updatedAt, ...fields } = subject;
      assert.deepEqual(fields, expected);
      assert.equal(typeof createdAt, 'string');
      assert.equal(typeof updatedAt, 'string');
      assert.equal(new Date(createdAt).toISOString(), createdAt);
      assert.equal(new Date(updatedAt).toISOString(), updatedAt);

      const detailResponse = await get(`/api/subjects/${expected.id}`);
      assert.equal(detailResponse.status, 200);
      assert.deepEqual(await detailResponse.json(), subject);
    }
  });

  await suite.test(
    'SSR includes subject data in the initial document without JavaScript',
    async () => {
      const response = await get('/subjects');
      assert.equal(response.status, 200);
      const index = await response.text();
      assert.equal(headingText(index), 'Materias');
      for (const subject of subjects) {
        assert.ok(
          visibleText(index).includes(subject.name),
          'The server must render each subject.',
        );
        assert.ok(
          index.includes(`/subjects/${subject.id}`),
          'The subject must link to its detail.',
        );
        const detailResponse = await get(`/subjects/${subject.id}`);
        assert.equal(detailResponse.status, 200);
        const detail = await detailResponse.text();
        assert.equal(headingText(detail), subject.name);
        assert.ok(visibleText(detail).includes(subject.professor));
        assert.ok(visibleText(detail).includes(subject.code));
      }
    },
  );

  await suite.test('CSR returns only a client shell for the root and both subroutes', async () => {
    for (const path of ['/tools', '/tools/calculator', '/tools/faq']) {
      const response = await get(path);
      assert.equal(response.status, 200, path);
      const html = await response.text();
      assert.doesNotMatch(html, /<h1\b/i, `${path} must render its page in the browser.`);
      assert.match(
        html,
        /<script\b(?=[^>]*\bid=["']__NUXT_DATA__["'])(?=[^>]*\bdata-ssr=["']false["'])[^>]*>/i,
        `${path} must declare a client-rendered Nuxt payload.`,
      );
    }
  });

  await suite.test(
    'unknown articles and invalid subject identifiers respond with 404',
    async () => {
      const paths = [
        '/blog/no-existe',
        '/subjects/no-existe',
        ...['1abc', '1e0', '0', '999'].flatMap((id) => [`/subjects/${id}`, `/api/subjects/${id}`]),
        '/api/subjects/no-existe',
      ];
      for (const path of paths) {
        const response = await get(path);
        await response.arrayBuffer();
        assert.equal(response.status, 404, path);
      }
    },
  );
});
