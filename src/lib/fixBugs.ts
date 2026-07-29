// /fix — pool of small broken components for the live bug-fix challenge. Each
// entry is a full, self-contained HTML document (rendered in a sandboxed
// `srcdoc` iframe, never on the live page). Every doc wires its own "Test"
// button to a deterministic check that inspects the resulting DOM/computed
// style — not a fragile string compare of the source — and reports the
// result to the parent window via postMessage.

export type FixBug = {
  id: string;
  title: string;
  category: string;
  hint: string;
  srcdoc: string;
};

const shell = (body: string) => `<!doctype html><html><head><meta charset="utf-8" />
<style>
  * { box-sizing: border-box; }
  body { font-family: system-ui, sans-serif; margin: 0; padding: 18px; color: #222; background: #fff; }
  button { font: inherit; padding: 7px 14px; border-radius: 6px; border: 1px solid #ccc;
    background: #f4f4f5; cursor: pointer; margin-top: 10px; margin-inline-end: 8px; }
  button:hover { background: #e9e9ec; }
</style></head><body>${body}</body></html>`;

export const FIX_BUGS: FixBug[] = [
  {
    id: 'toggle-theme',
    title: 'Toggle theme button',
    category: 'JS logic',
    hint: "The button handler is changing the wrong style property — it's not the text color that should change.",
    srcdoc: shell(`
  <div id="box" style="width:160px;height:90px;background:#ddd;border-radius:8px;
    display:flex;align-items:center;justify-content:center;transition:background .2s;">Click below</div>
  <button id="toggle">Toggle theme</button>
  <button id="run-test">Test</button>
  <script>
    function applyDark(box) {
      // BUG: should set backgroundColor, not color
      box.style.color = '#111111';
    }
    document.getElementById('toggle').addEventListener('click', () => {
      applyDark(document.getElementById('box'));
    });
    document.getElementById('run-test').addEventListener('click', () => {
      const box = document.getElementById('box');
      box.style.background = '#dddddd';
      box.style.color = '';
      applyDark(box);
      const bg = getComputedStyle(box).backgroundColor;
      parent.postMessage({ type: 'fix-test-result', pass: bg === 'rgb(17, 17, 17)' }, '*');
    });
  </script>`),
  },
  {
    id: 'status-card',
    title: 'Status card highlight',
    category: 'CSS selector',
    hint: 'The class the button adds and the class name in the CSS rule are spelled slightly differently.',
    srcdoc: shell(`
  <style>.card { padding: 14px; border-radius: 8px; background: #eee; width: 180px; }
  .is-actve { background: #22c55e; color: white; }</style>
  <div class="card" id="card">Status card</div>
  <button id="activate">Activate</button>
  <button id="run-test">Test</button>
  <script>
    document.getElementById('activate').addEventListener('click', () => {
      document.getElementById('card').classList.add('is-active');
    });
    document.getElementById('run-test').addEventListener('click', () => {
      const card = document.getElementById('card');
      card.className = 'card';
      card.classList.add('is-active');
      const bg = getComputedStyle(card).backgroundColor;
      parent.postMessage({ type: 'fix-test-result', pass: bg === 'rgb(34, 197, 94)' }, '*');
    });
  </script>`),
  },
  {
    id: 'item-list',
    title: 'Five-item list',
    category: 'Off-by-one',
    hint: 'The loop condition stops one item short of the five it should render.',
    srcdoc: shell(`
  <ul id="list"></ul>
  <button id="run-test">Test</button>
  <script>
    function renderList() {
      const list = document.getElementById('list');
      list.innerHTML = '';
      // BUG: should render 5 items
      for (let i = 1; i <= 4; i++) {
        const li = document.createElement('li');
        li.textContent = 'Item ' + i;
        list.appendChild(li);
      }
    }
    renderList();
    document.getElementById('run-test').addEventListener('click', () => {
      renderList();
      const pass = document.querySelectorAll('#list li').length === 5;
      parent.postMessage({ type: 'fix-test-result', pass }, '*');
    });
  </script>`),
  },
  {
    id: 'reveal-answer',
    title: 'Reveal answer button',
    category: 'Wrong event type',
    hint: "The listener fires on hover, not on click — think about what happens on a touchscreen with no mouse.",
    srcdoc: shell(`
  <button id="reveal">Reveal answer</button>
  <div id="answer" style="display:none;padding:10px;background:#eee;border-radius:6px;margin-top:10px;">42</div>
  <button id="run-test">Test</button>
  <script>
    function showAnswer() { document.getElementById('answer').style.display = 'block'; }
    // BUG: should listen for 'click'
    document.getElementById('reveal').addEventListener('mouseover', showAnswer);
    document.getElementById('run-test').addEventListener('click', () => {
      document.getElementById('answer').style.display = 'none';
      document.getElementById('reveal').dispatchEvent(new MouseEvent('click', { bubbles: true }));
      const pass = getComputedStyle(document.getElementById('answer')).display === 'block';
      parent.postMessage({ type: 'fix-test-result', pass }, '*');
    });
  </script>`),
  },
  {
    id: 'like-counter',
    title: 'Like counter',
    category: 'Async/timing',
    hint: "The count is read right after the async increment is kicked off, not once it's actually finished updating.",
    srcdoc: shell(`
  <p>Likes: <span id="count">0</span></p>
  <button id="like">Like</button>
  <button id="run-test">Test</button>
  <script>
    let likeCount = 0;
    function incrementLikes(cb) {
      setTimeout(() => { likeCount++; cb(likeCount); }, 200);
    }
    document.getElementById('like').addEventListener('click', () => {
      incrementLikes(() => {});
      // BUG: reads likeCount immediately instead of inside the callback
      document.getElementById('count').textContent = likeCount;
    });
    document.getElementById('run-test').addEventListener('click', () => {
      document.getElementById('like').click();
      setTimeout(() => {
        const shown = document.getElementById('count').textContent;
        parent.postMessage({ type: 'fix-test-result', pass: shown === String(likeCount) }, '*');
      }, 400);
    });
  </script>`),
  },
  {
    id: 'centered-card',
    title: 'Centered card row',
    category: 'Flexbox layout',
    hint: 'Two flex properties are set to align things to the start instead of the center.',
    srcdoc: shell(`
  <style>.row { display: flex; width: 300px; height: 120px; background: #f5f5f5; border-radius: 8px;
    align-items: flex-start; justify-content: flex-start; }
  .card { width: 60px; height: 60px; background: #6366f1; border-radius: 6px; }</style>
  <div class="row" id="row"><div class="card" id="card"></div></div>
  <button id="run-test">Test</button>
  <script>
    document.getElementById('run-test').addEventListener('click', () => {
      const row = document.getElementById('row').getBoundingClientRect();
      const card = document.getElementById('card').getBoundingClientRect();
      const cx = Math.abs((card.left + card.width / 2) - (row.left + row.width / 2)) < 4;
      const cy = Math.abs((card.top + card.height / 2) - (row.top + row.height / 2)) < 4;
      parent.postMessage({ type: 'fix-test-result', pass: cx && cy }, '*');
    });
  </script>`),
  },
];

export function pickBug(excludeIds: string[]): FixBug {
  const pool = FIX_BUGS.filter(b => !excludeIds.includes(b.id));
  const from = pool.length > 0 ? pool : FIX_BUGS;
  return from[Math.floor(Math.random() * from.length)];
}
