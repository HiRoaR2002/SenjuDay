import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* ───────────── EDIT THESE ───────────── */
const NAME = "Senju";
const FULL_NAME = "Senjuti";
const FROM = "Your bestie";
const SUBTITLE = "Another year of you being the best thing in everyone's life.";
const REASONS = [
  { icon: "😂", title: "Your laugh", text: "Funniest 'hehe' I have heard!" },
  { icon: "🫶", title: "Your heart", text: "You are very brave GIRL, be like that forever" },
  { icon: "🌙", title: "Late-night talks", text: "No one gets my 12am thoughts like you do." },
  { icon: "✨", title: "Your vibe", text: "You make every room feel warmer just by walking in." },
  { icon: "🍕", title: "Food plans", text: "Still pending, but we sure are foodie DUO" },
  { icon: "🦋", title: "Your growth", text: "Watching you become you has been my favourite thing." },
];
const LETTER = [
  `Dear ${NAME},`,
  "Happy birthday to the person who I am never bored to talk to and to my Good Morning and Good Night",
  "Thank you for the silly memories, the honest advice, and the endless support.",
  "I hope this year gives you everything you give to others, and then some.",
];
const WISH = "Make a wish, Senju. I already know it's going to come true. 💫";
/* ────────────────────────────────────── */

const COLORS = ["#ffc857", "#ff6f91", "#7ee8c7", "#b79bff", "#ff9a5a", "#fff4e6"];

/* Confetti on a canvas, no dependencies */
function useConfetti() {
  const ref = useRef(null);
  const parts = useRef([]);
  const raf = useRef(0);

  const loop = useCallback(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    parts.current = parts.current.filter((p) => p.life > 0 && p.y < c.height + 30);
    for (const p of parts.current) {
      p.vy += 0.13;
      p.vx *= 0.992;
      p.x += p.vx + Math.sin(p.life / 12) * 0.4;
      p.y += p.vy;
      p.r += p.vr;
      p.life -= 1;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.globalAlpha = Math.min(1, p.life / 40);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.s / 2, -p.s / 3, p.s, p.s * 0.6);
      ctx.restore();
    }
    if (parts.current.length) raf.current = requestAnimationFrame(loop);
  }, []);

  const burst = useCallback(
    (x, y, n = 140) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const v = 4 + Math.random() * 9;
        parts.current.push({
          x, y,
          vx: Math.cos(a) * v,
          vy: Math.sin(a) * v - 5,
          s: 6 + Math.random() * 8,
          r: Math.random() * 6,
          vr: (Math.random() - 0.5) * 0.4,
          c: COLORS[(Math.random() * COLORS.length) | 0],
          life: 140 + Math.random() * 80,
        });
      }
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(loop);
    },
    [loop]
  );

  useEffect(() => {
    const fit = () => {
      if (!ref.current) return;
      ref.current.width = window.innerWidth;
      ref.current.height = window.innerHeight;
    };
    fit();
    window.addEventListener("resize", fit);
    return () => {
      window.removeEventListener("resize", fit);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return { ref, burst };
}

function useTypewriter(text, active, speed = 45) {
  const [out, setOut] = useState("");
  useEffect(() => {
    if (!active) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, active, speed]);
  return out;
}

/* Fades a section in when it scrolls into view */
function Reveal({ children, className = "", delay = 0 }) {
  const el = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (el.current) io.observe(el.current);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={el}
      className={`reveal ${seen ? "in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function Balloons() {
  const items = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        left: Math.random() * 94,
        size: 38 + Math.random() * 34,
        delay: Math.random() * 12,
        dur: 12 + Math.random() * 10,
        color: COLORS[i % 5],
      })),
    []
  );
  return (
    <div className="balloons" aria-hidden="true">
      {items.map((b, i) => (
        <span
          key={i}
          className="balloon"
          style={{
            left: `${b.left}%`,
            width: b.size,
            height: b.size * 1.25,
            background: b.color,
            animationDuration: `${b.dur}s`,
            animationDelay: `-${b.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function Cake({ blown, onBlow }) {
  const candles = [70, 105, 140, 175];
  return (
    <svg className="cake" viewBox="0 0 240 230" role="img" aria-label="Birthday cake with candles">
      <ellipse cx="120" cy="212" rx="105" ry="12" fill="#00000040" />
      <rect x="25" y="150" width="190" height="58" rx="12" fill="#ff6f91" />
      <rect x="45" y="100" width="150" height="56" rx="12" fill="#ffc857" />
      <path d="M45 118c15 16 25-4 40 10s25-8 40 6 25-10 40 4 20-4 30-2v-22H45z" fill="#fff4e6" />
      <path d="M25 168c14 16 28-2 44 10s28-8 44 6 28-10 44 4 28-6 38-2v-26H25z" fill="#fff4e6" />
      {[60, 100, 140, 180].map((x) => (
        <circle key={x} cx={x} cy="192" r="5" fill="#7ee8c7" />
      ))}
      {candles.map((x, i) => (
        <g key={x}>
          <rect x={x - 4} y="62" width="8" height="40" rx="3" fill={COLORS[(i + 2) % 5]} />
          <ellipse
            className={`flame ${blown ? "out" : ""}`}
            style={{ animationDelay: `${i * 0.18}s` }}
            cx={x} cy="50" rx="6" ry="11" fill="#ffd36b"
          />
          <circle className={`smoke ${blown ? "go" : ""}`} cx={x} cy="48" r="4" fill="#fff4e6" />
        </g>
      ))}
    </svg>
  );
}

export default function SenjuBirthday() {
  const [opened, setOpened] = useState(false);
  const [gone, setGone] = useState(false);
  const [blown, setBlown] = useState(false);
  const [flipped, setFlipped] = useState({});
  const { ref, burst } = useConfetti();
  const typed = useTypewriter(SUBTITLE, opened);
  const wish = useTypewriter(WISH, blown, 40);

  const openGift = (e) => {
    setOpened(true);
    burst(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2, 220);
    setTimeout(() => setGone(true), 1400);
  };

  const blow = (e) => {
    if (blown) return;
    setBlown(true);
    const r = e.currentTarget.getBoundingClientRect();
    setTimeout(() => burst(r.left + r.width / 2, r.top + r.height / 3, 200), 500);
  };

  return (
    <div className="app">
      <style>{CSS}</style>
      <canvas ref={ref} className="confetti" />
      <div className="stars" aria-hidden="true" />
      <Balloons />

      {!gone && (
        <div className={`gate ${opened ? "opening" : ""}`}>
          <button className="gift" onClick={openGift} aria-label="Open your gift">
            <span className="lid" />
            <span className="box" />
            <span className="ribbon-v" />
          </button>
          <p className="gate-text">A little something for you, {NAME}</p>
          <p className="gate-hint">tap the gift</p>
        </div>
      )}

      <main className={`main ${opened ? "show" : ""}`}>
        {/* HERO */}
        <section className="hero">
          <p className="pre">It's your day</p>
          <h1 className="title" aria-label={`Happy Birthday ${NAME}`}>
            <span className="line">
              {"Happy Birthday".split("").map((ch, i) => (
                <span
                  key={i}
                  className="ch"
                  style={{ animationDelay: `${opened ? 1.2 + i * 0.05 : 99}s` }}
                >
                  {ch === " " ? "\u00A0" : ch}
                </span>
              ))}
            </span>
            <span className="line name">
              {(NAME + "!").split("").map((ch, i) => (
                <span
                  key={i}
                  className="ch big"
                  style={{ animationDelay: `${opened ? 2 + i * 0.12 : 99}s` }}
                >
                  {ch}
                </span>
              ))}
            </span>
          </h1>
          <p className="sub">
            {typed}
            <i className="caret" />
          </p>
          <div className="scroll-cue" aria-hidden="true">↓</div>
        </section>

        {/* CAKE */}
        <section className="sec center">
          <Reveal>
            <h2>Time for the candles</h2>
            <p className="muted">Tap the cake and make a wish</p>
          </Reveal>
          <Reveal delay={150}>
            <button className="cake-btn" onClick={blow} aria-label="Blow out the candles">
              <Cake blown={blown} />
            </button>
            <p className="wish">{wish}</p>
            {blown && (
              <button className="ghost" onClick={(e) => burst(e.clientX, e.clientY, 160)}>
                More confetti 🎉
              </button>
            )}
          </Reveal>
        </section>

        {/* REASONS */}
        <section className="sec">
          <Reveal>
            <h2 className="center-h">Why {NAME} is the best</h2>
            <p className="muted center-h">Tap a card</p>
          </Reveal>
          <div className="grid">
            {REASONS.map((r, i) => (
              <Reveal key={r.title} delay={i * 90}>
                <button
                  className={`flip ${flipped[i] ? "on" : ""}`}
                  onClick={() => setFlipped((f) => ({ ...f, [i]: !f[i] }))}
                  aria-pressed={!!flipped[i]}
                >
                  <span className="face front">
                    <span className="emoji">{r.icon}</span>
                    <strong>{r.title}</strong>
                  </span>
                  <span className="face back">{r.text}</span>
                </button>
              </Reveal>
            ))}
          </div>
        </section>

        {/* LETTER */}
        <section className="sec">
          <Reveal className="letter">
            {LETTER.map((p, i) => (
              <p key={i} className={i === 0 ? "greet" : ""}>
                {p}
              </p>
            ))}
            <p className="sign">
              Forever yours,
              <br />
              {FROM} 💛
            </p>
          </Reveal>
        </section>

        {/* FINALE */}
        <section className="sec center finale">
          <Reveal>
            <div className="big-emoji">🎂</div>
            <h2>Happy Birthday, {FULL_NAME}!</h2>
            <button
              className="cta"
              onClick={(e) => {
                burst(e.clientX, e.clientY, 260);
                setTimeout(() => burst(window.innerWidth * 0.2, window.innerHeight * 0.5, 120), 250);
                setTimeout(() => burst(window.innerWidth * 0.8, window.innerHeight * 0.5, 120), 450);
              }}
            >
              Celebrate again 🎊
            </button>
          </Reveal>
        </section>
      </main>
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,800;1,9..144,600&family=Nunito:wght@400;600;700&display=swap');

.app{
  --plum:#1b1030; --plum2:#2c1850; --gold:#ffc857; --rose:#ff6f91; --mint:#7ee8c7; --cream:#fff4e6;
  min-height:100vh; background:radial-gradient(120% 80% at 50% 0%, var(--plum2), var(--plum) 70%);
  color:var(--cream); font-family:'Nunito',system-ui,sans-serif; position:relative; overflow-x:hidden;
}
.app *{box-sizing:border-box}
.confetti{position:fixed; inset:0; pointer-events:none; z-index:50}

/* ambient */
.stars{position:fixed; inset:0; pointer-events:none; opacity:.7;
  background-image:
    radial-gradient(2px 2px at 20% 30%, #fff, transparent),
    radial-gradient(1.5px 1.5px at 70% 20%, #fff, transparent),
    radial-gradient(2px 2px at 85% 65%, #ffc857, transparent),
    radial-gradient(1.5px 1.5px at 35% 80%, #fff, transparent),
    radial-gradient(2px 2px at 55% 55%, #7ee8c7, transparent),
    radial-gradient(1.5px 1.5px at 10% 70%, #fff, transparent);
  animation:twinkle 4s ease-in-out infinite alternate}
@keyframes twinkle{from{opacity:.25}to{opacity:.9}}

.balloons{position:fixed; inset:0; pointer-events:none; z-index:1; overflow:hidden}
.balloon{position:absolute; bottom:-120px; border-radius:50% 50% 48% 48%; opacity:.85;
  animation:rise linear infinite; box-shadow:inset -8px -10px 0 #00000022}
.balloon::after{content:""; position:absolute; left:50%; top:100%; width:1.5px; height:60px; background:#fff6; transform:translateX(-50%)}
@keyframes rise{
  0%{transform:translate(0,0) rotate(-4deg)}
  50%{transform:translate(24px,-60vh) rotate(5deg)}
  100%{transform:translate(-12px,-130vh) rotate(-4deg)}
}

/* gift gate */
.gate{position:fixed; inset:0; z-index:40; display:flex; flex-direction:column; align-items:center; justify-content:center;
  gap:10px; background:radial-gradient(100% 80% at 50% 40%, var(--plum2), var(--plum)); transition:opacity .8s ease .6s}
.gate.opening{opacity:0; pointer-events:none}
.gift{position:relative; width:min(46vw,190px); aspect-ratio:1; background:none; border:0; cursor:pointer; animation:wobble 2s ease-in-out infinite}
.gift:focus-visible{outline:3px solid var(--gold); outline-offset:10px; border-radius:16px}
.opening .gift{animation:none}
.box{position:absolute; left:6%; right:6%; bottom:0; height:62%; background:var(--rose); border-radius:8px 8px 14px 14px}
.lid{position:absolute; left:0; right:0; top:14%; height:26%; background:#ff8fa9; border-radius:8px; z-index:2;
  transition:transform .9s cubic-bezier(.3,1.6,.5,1), opacity .9s}
.opening .lid{transform:translateY(-140px) rotate(-24deg); opacity:0}
.ribbon-v{position:absolute; left:46%; width:8%; top:14%; bottom:0; background:var(--gold); z-index:3}
.lid::after{content:"🎀"; position:absolute; left:50%; top:-60%; transform:translateX(-50%); font-size:clamp(34px,9vw,54px)}
@keyframes wobble{0%,100%{transform:rotate(-4deg) translateY(0)}50%{transform:rotate(4deg) translateY(-12px)}}
.gate-text{font-family:'Fraunces',serif; font-size:clamp(1.3rem,5.5vw,1.9rem); font-weight:600; margin:22px 0 0; text-align:center; padding:0 20px}
.gate-hint{margin:0; color:var(--gold); animation:pulse 1.6s ease-in-out infinite}
@keyframes pulse{50%{opacity:.35}}

/* layout */
.main{position:relative; z-index:2; opacity:0; transition:opacity 1s ease .3s}
.main.show{opacity:1}
.sec{padding:clamp(56px,10vw,110px) 20px; max-width:980px; margin:0 auto}
.center{text-align:center}
.center-h{text-align:center}
h2{font-family:'Fraunces',serif; font-weight:800; font-size:clamp(1.8rem,6.5vw,3rem); margin:0 0 8px; line-height:1.1}
.muted{color:#fff4e6aa; margin:0 0 28px}

/* hero */
.hero{min-height:100vh; min-height:100svh; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:24px 16px}
.pre{font-style:italic; font-family:'Fraunces',serif; color:var(--gold); font-size:clamp(1rem,4vw,1.4rem); margin:0 0 10px}
.title{font-family:'Fraunces',serif; margin:0; display:flex; flex-direction:column; align-items:center; line-height:1}
.line{display:block; font-size:clamp(2.1rem,10.5vw,5.4rem); font-weight:600}
.line.name{font-size:clamp(4.2rem,26vw,12rem); font-weight:800; color:var(--gold); margin-top:.05em;
  text-shadow:0 0 40px #ffc85766, 0 6px 0 #c9903a}
.ch{display:inline-block; opacity:0; transform:translateY(60px) scale(.6) rotate(-12deg); animation:pop .7s cubic-bezier(.3,1.7,.5,1) forwards}
.ch.big{animation-name:popbig}
@keyframes pop{to{opacity:1; transform:none}}
@keyframes popbig{
  0%{opacity:0; transform:translateY(120px) scale(.3) rotate(-25deg)}
  70%{opacity:1; transform:translateY(-14px) scale(1.12) rotate(4deg)}
  100%{opacity:1; transform:none}
}
.name .ch.big{animation-fill-mode:forwards}
.name .ch.big:hover{animation:none; opacity:1; transform:translateY(-10px) rotate(-6deg); transition:transform .25s}
.sub{min-height:3.2em; max-width:30ch; margin:22px 0 0; font-size:clamp(1rem,4vw,1.3rem); color:#fff4e6dd}
.caret{display:inline-block; width:2px; height:1.1em; background:var(--gold); margin-left:3px; vertical-align:-.15em; animation:blink 1s steps(1) infinite}
@keyframes blink{50%{opacity:0}}
.scroll-cue{margin-top:24px; font-size:1.8rem; color:var(--mint); animation:bounce 1.5s ease-in-out infinite}
@keyframes bounce{50%{transform:translateY(10px)}}

/* reveal */
.reveal{opacity:0; transform:translateY(36px); transition:opacity .8s ease, transform .8s cubic-bezier(.2,.8,.2,1)}
.reveal.in{opacity:1; transform:none}

/* cake */
.cake-btn{background:none; border:0; cursor:pointer; padding:0; display:block; margin:0 auto}
.cake-btn:focus-visible{outline:3px solid var(--gold); outline-offset:8px; border-radius:20px}
.cake{width:min(78vw,340px); height:auto; filter:drop-shadow(0 18px 30px #0007); transition:transform .3s}
.cake-btn:hover .cake{transform:scale(1.03) rotate(-1deg)}
.flame{transform-box:fill-box; transform-origin:50% 100%; animation:flicker .45s ease-in-out infinite alternate; filter:drop-shadow(0 0 8px #ffc857)}
.flame.out{animation:none; transform:scale(0); opacity:0; transition:transform .4s, opacity .3s}
@keyframes flicker{from{transform:scale(1,1) rotate(-3deg)}to{transform:scale(.88,1.12) rotate(3deg)}}
.smoke{opacity:0; transform-box:fill-box}
.smoke.go{animation:smoke 1.6s ease-out forwards}
@keyframes smoke{0%{opacity:.8; transform:translateY(0) scale(.6)}100%{opacity:0; transform:translateY(-46px) scale(2.2)}}
.wish{min-height:3.4em; font-family:'Fraunces',serif; font-style:italic; font-size:clamp(1.1rem,4.5vw,1.5rem); max-width:26ch; margin:22px auto 10px; color:var(--mint)}
.ghost,.cta{font:inherit; font-weight:700; cursor:pointer; border-radius:999px; transition:transform .2s, box-shadow .2s}
.ghost{background:transparent; color:var(--cream); border:2px solid var(--cream); padding:10px 22px; animation:fadein .6s ease}
.ghost:hover{transform:scale(1.06)}
@keyframes fadein{from{opacity:0; transform:translateY(8px)}}

/* flip cards */
.grid{display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr)); gap:18px; margin-top:8px}
.flip{position:relative; width:100%; height:190px; background:none; border:0; padding:0; cursor:pointer; perspective:900px; color:inherit; font:inherit}
.flip:focus-visible{outline:3px solid var(--gold); outline-offset:4px; border-radius:20px}
.face{position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px;
  padding:18px; border-radius:20px; backface-visibility:hidden; transition:transform .7s cubic-bezier(.3,1.3,.5,1); text-align:center}
.front{background:linear-gradient(145deg,#3a2268,#2a1650); border:1.5px solid #ffffff22}
.front strong{font-family:'Fraunces',serif; font-size:1.25rem}
.emoji{font-size:2.6rem; animation:bob 2.6s ease-in-out infinite}
.flip:nth-child(odd) .emoji{animation-delay:-1.3s}
@keyframes bob{50%{transform:translateY(-7px) rotate(6deg)}}
.back{background:var(--gold); color:#3a2268; font-weight:700; font-size:1.05rem; line-height:1.4; transform:rotateY(180deg)}
.flip.on .front{transform:rotateY(180deg)}
.flip.on .back{transform:rotateY(360deg)}
.flip:hover .front{border-color:var(--gold)}

/* letter */
.letter{max-width:600px; margin:0 auto; background:var(--cream); color:#3a2248; padding:clamp(24px,6vw,48px); border-radius:6px 22px 6px 22px;
  box-shadow:0 24px 50px #0006; font-family:'Fraunces',serif; font-size:clamp(1.05rem,4.2vw,1.25rem); line-height:1.65; transform:rotate(-1.2deg)}
.letter.in{transform:rotate(-1.2deg)}
.letter p{margin:0 0 1em}
.letter .greet{font-size:1.5em; font-weight:800; color:var(--rose)}
.letter .sign{font-style:italic; margin:1.6em 0 0}

/* finale */
.finale{padding-bottom:140px}
.big-emoji{font-size:clamp(4rem,18vw,7rem); animation:wobble 2.4s ease-in-out infinite}
.cta{margin-top:22px; background:linear-gradient(135deg,var(--rose),var(--gold)); color:#2a1245; border:0; padding:16px 34px; font-size:1.15rem; box-shadow:0 10px 30px #ff6f9155}
.cta:hover{transform:translateY(-3px) scale(1.04); box-shadow:0 16px 40px #ff6f9188}
.cta:active{transform:scale(.97)}
.cta:focus-visible,.ghost:focus-visible{outline:3px solid var(--mint); outline-offset:4px}

@media (prefers-reduced-motion:reduce){
  .app *,.app *::before,.app *::after{animation-duration:.01ms !important; animation-iteration-count:1 !important; transition-duration:.01ms !important}
  .ch{opacity:1; transform:none}
}
`;