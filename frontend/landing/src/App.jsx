import "./App.css";
import logo from "./assets/logo.png";

function App() {
  return (
    <div className="page">
      <div className="landing">
        <nav className="navbar">
          <div className="nav-left">
            <button className="nav-pill"><a href="#">Home</a></button>
            <button className="nav-pill"><a href="#what-we-do">What We Do</a></button>
            <button className="nav-pill"><a href="#about-us">About Us</a></button>
            <button className="nav-pill"><a href="#contact">Contact</a></button>
          </div>

          <div className="nav-center">
            <img src={logo} alt="Zenith-Care" />
          </div>

          <div className="nav-right">
            <button className="nav-pill"><a href="#how-it-works">How it works</a></button>
            <button className="nav-primary">Book Now</button>
          </div>
        </nav>

        <section className="hero">
          <h1>
            Discover Hospitals, Access Care, &<br />
            Find Trusted Services Nearby
          </h1>

          <p>
            Search trusted hospitals for top-notch care and easy appointments.
            <br />
            Get real-time access to healthcare services near you.
          </p>

          <button className="hero-cta">
            <span>Find Hospital</span>
            <span className="cta-icon">→</span>
          </button>

        <div className="hero-bottom">
          <div className="hero-proof">

            <div className="proof-text">
              <strong>Early pilot users</strong>
              <span>Transparent. Fair. Real-time OPD queues.</span>
            </div>
          </div>

          <button className="hero-pwa">
            Add to Home Screen
          </button>
        </div>
        </section>
      </div>

        <section className="what-we-do" id="what-we-do">
          <div className="what-header">
            <span className="tag">What We Do</span>
            <h2>Smarter OPD Experience for Everyone</h2>
          </div>

          <div className="what-cards">
            <div className="what-card">
              <img src="/waiting.jpg" alt="" />
              <div className="card-content">
                <h3>No More Waiting Chaos</h3>
                <p>
                  Patients see live queue status and accurate wait times,
                  reducing overcrowding and confusion.
                </p>
              </div>
            </div>

            <div className="what-card">
              <img src="/fair.jpg" alt="" />
              <div className="card-content">
                <h3>Fair & Transparent Queuing</h3>
                <p>
                  First-come, first-served system with tamper-proof
                  automated token generation.
                </p>
              </div>
            </div>

            <div className="what-card">
              <img src="/emergency.jpg" alt="" />
              <div className="card-content">
                <h3>Emergency Handling</h3>
                <p>
                  OPD queues can be instantly paused during emergencies,
                  keeping patients informed in real time.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="how-it-works" id="how-it-works">
        <div className="how-header">
          <span className="tag">How It Works</span>
          <h2>Simple. Transparent. Real-Time.</h2>
          <p>
            Zenith-Care streamlines OPD visits by keeping patients and hospitals
            perfectly in sync.
          </p>
        </div>

        <div className="how-steps">
          <div className="how-step">
            <img src="/booking.png" alt="" />
            <h3>Easy Booking</h3>
            <p>
              Patients book their spot via app or reception without disrupting
              existing workflows.
            </p>
          </div>

          <div className="how-step">
            <img src="/queue.png" alt="" />
            <h3>Real-Time Queue</h3>
            <p>
              Live updates show queue position and accurate estimated wait times.
            </p>
          </div>

          <div className="how-step">
            <img src="/opd.png" alt="" />
            <h3>Streamlined OPD</h3>
            <p>
              Reception manages flow efficiently while doctors focus on care.
            </p>
          </div>
        </div>
        </section>

      <section className="about-us" id="about-us">
        <h2 className="about-title">
          Explore Options About Zenith-Care,<br />
          Your Health, Our Priority
        </h2>

        <div className="about-grid">
          {/* LEFT CONTENT */}
          <div className="about-content">
            <span className="about-tag">About Us</span>

            <p className="about-text">
              Zenith-Care is a real-time OPD queue management platform designed
              to eliminate long waits, overcrowding, and uncertainty in hospitals.
              We help patients and healthcare providers stay perfectly aligned
              through transparent, fair, and intelligent queue systems.
            </p>

            <p className="about-text">
              Built with real hospital workflows in mind, Zenith-Care digitizes
              first-come-first-served appointments without disrupting existing
              operations — ensuring efficiency, trust, and better care experiences
              for everyone.
            </p>

            <button className="about-btn">
              Learn More
              <span>→</span>
            </button>
          </div>

          {/* RIGHT VISUALS */}
          <div className="about-cards">
            <div className="about-card large">
              <span className="card-tag">Smart OPD</span>
              <h3 className="ah3">Designed for real hospital environments</h3>
              <span className="card-action">↗</span>
            </div>

            <div className="about-card small">
              <span className="card-tag">Transparency</span>
              <p className="ah3">
                No priority abuse. No hidden queues. Just fair and real-time access.
              </p>
              <span className="card-action">↗</span>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-end" id="contact">
        <div className="contact-inner">

          {/* BIG BRAND STATEMENT */}
          <h1 className="contact-title">
            ZENITH-CARE —<br />
            SMARTER OPD, BETTER CARE
          </h1>

          {/* CENTER CONTENT */}
          <div className="contact-center">
            <p className="contact-quote">
              “Healthcare works best when time, transparency, and trust come together.
              Zenith-Care exists to bring clarity and calm back to OPD experiences.”
            </p>

            <p className="contact-sub">
              Built to support patients, reception teams, and doctors —
              without disrupting real hospital workflows.
            </p>

            <div className="contact-links">
              <a href="#about-us">About Us →</a>
              <a href="#how-it-works">How It Works →</a>
              <a href="#">Home →</a>
            </div>
          </div>

          {/* FOOTER STRIP */}
          <div className="contact-footer">
            <span>📞 Hospital onboarding via pilot program</span>
            <span>© 2026 Zenith-Care. All rights reserved.</span>
          </div>

        </div>
      </section>

    </div>
  );
}

export default App;
