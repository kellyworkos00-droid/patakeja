"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

const slideCount = 5;

const trustRows = [
  {
    title: "Verified Listings",
    text: "We check every home before it's listed",
  },
  {
    title: "Secure Chat",
    text: "Chat in-app. Your number stays private",
  },
  {
    title: "Safe Payments",
    text: "Pay securely when you're ready",
  },
];

export default function Home() {
  const [active, setActive] = useState(0);

  const canAdvance = active < slideCount - 1;
  const nextLabel = canAdvance ? "Continue" : "Get Started";

  const slideTitle = useMemo(() => {
    if (active === 0) {
      return "Find your next home, the smart way.";
    }

    if (active === 1) {
      return "Verified homes. Real people. Total trust.";
    }

    if (active === 2) {
      return "Homes near you, at the right price.";
    }

    if (active === 3) {
      return "Book viewings with ease.";
    }

    return "Your new home journey starts here.";
  }, [active]);

  const onNext = () => {
    setActive((prev) => (prev < slideCount - 1 ? prev + 1 : prev));
  };

  return (
    <main className="onboarding-wrap">
      <section className={`phone-frame slide-${active + 1}`}>
        <button type="button" className="skip-link" onClick={() => setActive(4)}>
          Skip
        </button>

        <div className="status-time">9:41</div>
        <div className="status-right" aria-hidden>
          <span />
          <span />
          <span />
        </div>

        {active === 0 && (
          <>
            <div className="logo-row">
              <Image src="/patakeja-logo.png" alt="PataKeja" width={170} height={44} />
            </div>
            <div className="content-block first-slide-text">
              <h1>
                Find your
                <br />
                next home,
                <br />
                the <span>smart</span> way.
              </h1>
              <p>
                Discover verified homes, connect securely and move in with
                confidence.
              </p>
            </div>
            <Image
              src="/onboarding-first-screen.png"
              alt="Calm interior"
              fill
              className="bg-shot"
              priority
            />
          </>
        )}

        {active === 1 && (
          <div className="content-block trust-slide">
            <h1>
              Verified homes.
              <br />
              Real people.
              <br />
              Total <span>trust.</span>
            </h1>
            <p>
              Every listing is verified for your safety. Chat securely without
              sharing personal contacts.
            </p>
            <div className="trust-cards">
              {trustRows.map((row) => (
                <article key={row.title} className="trust-row">
                  <div className="trust-icon">✓</div>
                  <div>
                    <h3>{row.title}</h3>
                    <p>{row.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {active === 2 && (
          <>
            <Image
              src="/onboarding-last-2.png"
              alt="Apartment view"
              fill
              className="bg-shot full-photo"
              priority
            />
            <div className="floating-chip">
              <p>Kilimani, Nairobi</p>
              <strong>2.3 km</strong>
              <span>away from you</span>
            </div>
            <div className="content-card overlay-card">
              <h2>
                Homes near you,
                <br />
                at the <span>right price.</span>
              </h2>
              <p>
                Explore homes in the best neighborhoods that fit your budget and
                lifestyle.
              </p>
            </div>
          </>
        )}

        {active === 3 && (
          <div className="content-block booking-slide">
            <h1>
              Book viewings
              <br />
              with <span>ease.</span>
            </h1>
            <p>
              Schedule viewings in a few taps and connect with landlords on your
              time.
            </p>
            <div className="calendar-card">
              <div className="calendar-top">
                <button type="button">‹</button>
                <strong>May 2026</strong>
                <button type="button">›</button>
              </div>
              <div className="calendar-grid">
                {Array.from({ length: 31 }).map((_, index) => (
                  <span key={index} className={index === 11 ? "selected" : ""}>
                    {index + 1}
                  </span>
                ))}
              </div>
            </div>
            <div className="mini-listing">
              <Image
                src="/concept-property-detail.png"
                alt="2 Bedroom Apartment"
                width={58}
                height={58}
              />
              <div>
                <h3>2 Bedroom Apartment</h3>
                <p>Kilimani</p>
                <span>Wed, 7 May 2026 • 11:00 AM</span>
              </div>
            </div>
          </div>
        )}

        {active === 4 && (
          <>
            <Image
              src="/onboarding-last-1.png"
              alt="Happy renter"
              fill
              className="bg-shot full-photo"
              priority
            />
            <div className="green-overlay" />
            <div className="content-card final-slide">
              <h1>
                Your new home
                <br />
                journey starts
                <br />
                <span>here.</span>
              </h1>
              <p>
                Thousands of people are finding homes they love on PataKeja.
                You're next.
              </p>
              <div className="social-proof">
                <strong>Join 10,000+ people</strong>
                <p>who've found their perfect home</p>
              </div>
              <Link href="/login" className="cta-btn">
                Get Started
              </Link>
              <p className="login-link">
                Already have an account? <Link href="/login">Log in</Link>
              </p>
            </div>
          </>
        )}

        <footer className="slide-footer">
          <div className="dots" aria-label="Onboarding progress">
            {Array.from({ length: slideCount }).map((_, index) => (
              <button
                key={index}
                type="button"
                className={index === active ? "dot active" : "dot"}
                onClick={() => setActive(index)}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>

          <button type="button" className="next-btn" onClick={onNext}>
            <span aria-hidden>→</span>
            <span className="sr-only">{nextLabel}</span>
          </button>
        </footer>
      </section>

      <p className="reference-note">{slideTitle}</p>
    </main>
  );
}
