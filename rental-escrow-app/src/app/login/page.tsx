import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="auth-page">
      <section className="auth-layout">
        <aside className="auth-showcase" aria-hidden>
          <Image
            src="/onboarding-last-1.png"
            alt=""
            fill
            className="auth-showcase-image"
            priority
          />
          <div className="auth-showcase-overlay" />
          <div className="auth-showcase-copy">
            <p className="auth-kicker">Patakeja Escrow Homes</p>
            <h1>Premium renting for tenants and landlords.</h1>
            <p>
              Verified homes, secure escrow payments, and wallet-first payouts in
              one trusted platform.
            </p>
          </div>
        </aside>

        <section className="auth-panel">
          <div className="auth-brand">
            <Image
              src="/patakeja-logo.png"
              alt="PataKeja"
              width={168}
              height={44}
            />
            <span>Welcome back</span>
          </div>

          <header className="auth-header">
            <h2>Log in to your account</h2>
            <p>Continue with Google, TikTok, or Apple.</p>
          </header>

          <div className="auth-clerk-shell">
            <SignIn
              path="/login"
              routing="path"
              forceRedirectUrl="/"
              fallbackRedirectUrl="/"
              appearance={{
                elements: {
                  rootBox: "auth-clerk-root",
                  cardBox: "auth-clerk-card",
                  card: "auth-clerk-card-inner",
                  header: "auth-clerk-hide",
                  footer: "auth-clerk-hide",
                  form: "auth-clerk-form",
                  socialButtonsBlockButton: "auth-provider-btn",
                  socialButtonsBlockButtonText: "auth-provider-btn-text",
                  socialButtonsBlockButtonArrow: "auth-clerk-hide",
                  dividerLine: "auth-divider-line",
                  dividerText: "auth-divider-text",
                  formButtonPrimary: "auth-email-btn",
                  formFieldLabel: "auth-form-label",
                  formFieldInput: "auth-form-input",
                },
              }}
            />
          </div>

          <footer className="auth-footer">
            <p>
              New here? <Link href="/">Start onboarding</Link>
            </p>
          </footer>
        </section>
      </section>
    </main>
  );
}
