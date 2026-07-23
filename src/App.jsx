import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  List,
  X,
} from "@phosphor-icons/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import landscapingImage from "./assets/project-landscaping.webp";
import horseImage from "./assets/project-horses.webp";
import mdnImage from "./assets/project-mdn.webp";

gsap.registerPlugin(ScrollTrigger);

const CrimsonScene = lazy(() => import("./CrimsonScene"));

const PROCESS_BEATS = [
  {
    title: "Find the signal.",
    body: "Strategy removes the noise and identifies the one idea the experience must communicate.",
  },
  {
    title: "Build the system.",
    body: "Type, spacing, color, and components become one repeatable visual language.",
  },
  {
    title: "Make it move.",
    body: "Motion clarifies hierarchy, rewards interaction, and gives the brand a physical character.",
  },
  {
    title: "Launch it clean.",
    body: "Fast loading, accessible behavior, responsive layouts, and clear conversion paths finish the work.",
  },
];

const PROJECTS = [
  {
    title: "Crimson Landscaping",
    summary: "A faster path from first visit to quote request.",
    services: "Strategy, web design, conversion",
    image: landscapingImage,
    url: "https://porspective.github.io/Cafe_Alley/",
  },
  {
    title: "Modern Horse Sales",
    summary: "A premium catalog designed around confident browsing.",
    services: "Art direction, interface, filtering",
    image: horseImage,
    url: "https://basecamping.net/",
  },
  {
    title: "MDN Lawns and Landscaping",
    summary: "A clear service funnel built for local search traffic.",
    services: "Web design, SEO structure, leads",
    image: mdnImage,
    url: "https://porspective.github.io/TheMont/",
  },
];

const CAPABILITIES = [
  {
    name: "Creative direction",
    detail: "A visual idea strong enough to guide every screen, interaction, and asset.",
  },
  {
    name: "Interface design",
    detail: "Clear responsive systems with strong hierarchy and precise interaction states.",
  },
  {
    name: "Motion and 3D",
    detail: "Cinematic movement that explains progress, rewards action, and builds memory.",
  },
  {
    name: "Front-end development",
    detail: "Production-ready builds with semantic structure, responsive behavior, and speed.",
  },
  {
    name: "AI automation",
    detail: "Practical workflows that move leads and admin work forward after the click.",
  },
];

const SYSTEM_STEPS = [
  ["Lead", "Capture the right details without making the form feel like paperwork."],
  ["Qualify", "Route the inquiry based on service, urgency, and fit."],
  ["Reply", "Send a useful response while interest is still high."],
  ["Schedule", "Move qualified leads into the next real action."],
  ["Follow up", "Keep opportunities from disappearing into an inbox."],
];

function ProjectCard({ project }) {
  const [imageState, setImageState] = useState("loading");

  return (
    <article className="project-card" data-project-card>
      <a
        className="project-card-link"
        href={project.url}
        target="_blank"
        rel="noreferrer"
        aria-label={`Open ${project.title} project in a new tab`}
      >
        <div className={`project-media image-${imageState}`}>
          {imageState === "error" ? (
            <div className="project-image-error">Preview unavailable</div>
          ) : (
            <img
              src={project.image}
              alt={`${project.title} project cover`}
              loading="lazy"
              onLoad={() => setImageState("loaded")}
              onError={() => setImageState("error")}
            />
          )}
        </div>
        <div className="project-copy">
          <div>
            <div className="project-title-row">
              <h3>{project.title}</h3>
              <ArrowUpRight size={25} aria-hidden="true" />
            </div>
            <p>{project.summary}</p>
          </div>
          <p className="project-services">{project.services}</p>
        </div>
      </a>
    </article>
  );
}

export default function App() {
  const pageRef = useRef(null);
  const progressRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCapability, setActiveCapability] = useState(0);
  const [activeSystemStep, setActiveSystemStep] = useState(0);
  const [formState, setFormState] = useState("idle");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    if (reduced) return undefined;

    const context = gsap.context(() => {
      gsap.from(".hero-reveal", {
        y: 38,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
      });

      const reveals = gsap.utils.toArray("[data-reveal]");
      reveals.forEach((element) => {
        gsap.from(element, {
          y: 46,
          autoAlpha: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 84%",
            once: true,
          },
        });
      });

      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          if (progressRef.current) {
            progressRef.current.style.transform = `scaleX(${self.progress})`;
          }
        },
      });

      if (!mobile) {
        const beats = gsap.utils.toArray(".process-beat");
        gsap.set(beats, { autoAlpha: 0, y: 28 });
        gsap.set(beats[0], { autoAlpha: 1, y: 0 });
        const processTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: "#process",
            start: "top top",
            end: "+=260%",
            pin: ".process-stage",
            pinSpacing: true,
            scrub: 1,
          },
        });

        beats.forEach((beat, index) => {
          if (index === 0) return;
          processTimeline
            .to(beats[index - 1], { autoAlpha: 0, y: -26, duration: 0.28 })
            .fromTo(
              beat,
              { autoAlpha: 0, y: 28 },
              { autoAlpha: 1, y: 0, duration: 0.34 },
              "<",
            );
        });

        const rail = document.querySelector(".work-track");
        const workSection = document.querySelector(".work-pin");
        if (rail && workSection) {
          const distance = () => Math.max(0, rail.scrollWidth - window.innerWidth + 80);
          gsap.to(rail, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: workSection,
              start: "top top",
              end: () => `+=${distance()}`,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });
        }
      }
    }, pageRef);

    return () => context.revert();
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const submitForm = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const project = String(data.get("project") || "").trim();

    if (!name || !email || !project) {
      setFormError("Add your name, email, and a short project summary.");
      setFormState("error");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setFormError("Enter a valid email address.");
      setFormState("error");
      return;
    }

    setFormError("");
    setFormState("loading");
    window.setTimeout(() => {
      setFormState("success");
      event.currentTarget?.reset();
    }, 700);
  };

  return (
    <div ref={pageRef} className="site-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Suspense fallback={null}>
        <CrimsonScene />
      </Suspense>

      <header className="site-header">
        <a className="brand" href="#top" onClick={closeMenu} aria-label="Crimson home">
          <span className="brand-mark">C</span>
          <span>CRIMSON</span>
          <span className="brand-name">PORTER ROBERTSON</span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#process">Process</a>
          <a href="#capabilities">Capabilities</a>
          <a href="#about">About</a>
        </nav>
        <a className="header-cta" href="#contact">
          Start a project
        </a>
        <button
          type="button"
          className="menu-toggle"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X size={23} /> : <List size={23} />}
        </button>
        <span ref={progressRef} className="scroll-progress" />
      </header>

      <div className={`mobile-menu ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
        <nav aria-label="Mobile navigation">
          <a href="#work" tabIndex={menuOpen ? 0 : -1} onClick={closeMenu}>Work</a>
          <a href="#process" tabIndex={menuOpen ? 0 : -1} onClick={closeMenu}>Process</a>
          <a href="#capabilities" tabIndex={menuOpen ? 0 : -1} onClick={closeMenu}>Capabilities</a>
          <a href="#about" tabIndex={menuOpen ? 0 : -1} onClick={closeMenu}>About</a>
          <a href="#contact" tabIndex={menuOpen ? 0 : -1} onClick={closeMenu}>Start a project</a>
        </nav>
      </div>

      <main id="main-content">
        <section id="top" className="hero section-grid" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow hero-reveal">Independent designer and developer</p>
            <h1 id="hero-title" className="hero-reveal">
              Websites <span>people remember.</span>
            </h1>
            <p className="hero-intro hero-reveal">
              Bold digital experiences built with motion, 3D, automation, and a clear conversion strategy.
            </p>
            <div className="hero-actions hero-reveal">
              <a className="button button-primary" href="#work">
                View work <ArrowRight size={17} weight="bold" />
              </a>
              <a className="button button-ghost" href="#contact">
                Start a project
              </a>
            </div>
          </div>
        </section>

        <section id="process" className="process-section" aria-labelledby="process-title">
          <div className="process-stage section-grid">
            <div className="process-intro">
              <h2 id="process-title">A website should feel as sharp as the business behind it.</h2>
            </div>
            <div className="process-beats" aria-live="polite">
              {PROCESS_BEATS.map((beat, index) => (
                <article className="process-beat" key={beat.title}>
                  <span className="beat-number">0{index + 1}</span>
                  <h3>{beat.title}</h3>
                  <p>{beat.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="work" className="work-section" aria-labelledby="work-title">
          <div className="work-pin">
            <div className="work-heading section-grid">
              <h2 id="work-title">Selected work</h2>
              <p>Brand direction, interaction, and code working as one system.</p>
            </div>
            <div className="work-track">
              {PROJECTS.map((project) => (
                <ProjectCard key={project.title} project={project} />
              ))}
              <div className="work-endcap" aria-hidden="true">
                <span>Built to be used.</span>
                <span>Designed to be remembered.</span>
              </div>
            </div>
          </div>
        </section>

        <section id="capabilities" className="capabilities-section section-grid" aria-labelledby="capabilities-title">
          <div className="capability-heading" data-reveal>
            <h2 id="capabilities-title">Design that performs after the wow.</h2>
            <p>The visual idea earns attention. The system underneath turns that attention into a useful next step.</p>
          </div>
          <div className="capability-layout">
            <div className="capability-list" role="list">
              {CAPABILITIES.map((capability, index) => (
                <button
                  type="button"
                  role="listitem"
                  className={activeCapability === index ? "is-active" : ""}
                  key={capability.name}
                  onMouseEnter={() => setActiveCapability(index)}
                  onFocus={() => setActiveCapability(index)}
                  onClick={() => setActiveCapability(index)}
                >
                  <span>{capability.name}</span>
                  <ArrowUpRight size={26} />
                </button>
              ))}
            </div>
            <div className="capability-detail" data-reveal>
              <span className="capability-glyph" aria-hidden="true">C</span>
              <p>{CAPABILITIES[activeCapability].detail}</p>
            </div>
          </div>
        </section>

        <section id="systems" className="systems-section section-grid" aria-labelledby="systems-title">
          <div className="systems-map" data-reveal>
            <div className="systems-line" aria-hidden="true" />
            {SYSTEM_STEPS.map(([name], index) => (
              <button
                type="button"
                key={name}
                className={activeSystemStep === index ? "is-active" : ""}
                onMouseEnter={() => setActiveSystemStep(index)}
                onFocus={() => setActiveSystemStep(index)}
                onClick={() => setActiveSystemStep(index)}
              >
                <span className="system-node" />
                <span>{name}</span>
              </button>
            ))}
          </div>
          <div className="systems-copy" data-reveal>
            <h2 id="systems-title">The website is only the front door.</h2>
            <p>I connect lead capture, follow-up, reviews, content, and invoicing so the work keeps moving after the click.</p>
            <div className="system-detail" aria-live="polite">
              <span>0{activeSystemStep + 1}</span>
              <p>{SYSTEM_STEPS[activeSystemStep][1]}</p>
            </div>
          </div>
        </section>

        <section id="about" className="about-section section-grid" aria-labelledby="about-title">
          <h2 id="about-title" data-reveal>Small studio.<br />Direct collaboration.</h2>
          <div className="about-copy" data-reveal>
            <p>You work with the person designing and building the experience. That keeps decisions fast, quality high, and the final result consistent.</p>
            <ul>
              <li><Check size={17} weight="bold" /> Strategy through launch</li>
              <li><Check size={17} weight="bold" /> Design and development in one workflow</li>
              <li><Check size={17} weight="bold" /> Automation when it solves a real bottleneck</li>
            </ul>
          </div>
        </section>

        <section id="contact" className="contact-section section-grid" aria-labelledby="contact-title">
          <div className="contact-heading" data-reveal>
            <h2 id="contact-title">Have something worth making unforgettable?</h2>
            <p>Tell me what you are building and what success looks like. I will return with a focused direction.</p>
          </div>

          {formState === "success" ? (
            <div className="form-success" role="status" data-reveal>
              <Check size={34} weight="bold" />
              <h3>Got it.</h3>
              <p>Your project brief is ready for the next step.</p>
              <button type="button" className="button button-ghost" onClick={() => setFormState("idle")}>Send another</button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={submitForm} noValidate data-reveal>
              <div className="field-pair">
                <label>
                  <span>Name</span>
                  <input name="name" autoComplete="name" placeholder="Your name" />
                </label>
                <label>
                  <span>Email</span>
                  <input name="email" type="email" autoComplete="email" placeholder="you@company.com" />
                </label>
              </div>
              <div className="field-pair">
                <label>
                  <span>Project type</span>
                  <select name="type" defaultValue="Website design">
                    <option>Website design</option>
                    <option>Motion and 3D</option>
                    <option>AI automation</option>
                    <option>Something else</option>
                  </select>
                </label>
                <label>
                  <span>Budget, optional</span>
                  <select name="budget" defaultValue="Not sure yet">
                    <option>Not sure yet</option>
                    <option>$1k-$3k</option>
                    <option>$3k-$7k</option>
                    <option>$7k+</option>
                  </select>
                </label>
              </div>
              <label>
                <span>What are you building?</span>
                <textarea name="project" rows="5" placeholder="The goal, the audience, and what needs to change." />
              </label>
              {formState === "error" && <p className="form-error" role="alert">{formError}</p>}
              <button className="button button-primary submit-button" type="submit" disabled={formState === "loading"}>
                {formState === "loading" ? "Preparing brief" : "Start a project"}
                <ArrowRight size={17} weight="bold" />
              </button>
            </form>
          )}

          <footer className="site-footer">
            <span>Crimson / Porter Robertson</span>
            <span>Web design, motion, and automation</span>
            <a href="#top">Back to top</a>
          </footer>
        </section>
      </main>
    </div>
  );
}
