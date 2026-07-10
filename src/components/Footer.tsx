import Link from "next/link";
import { Button } from "@/components/primitives/Button";
import { Logo } from "@/components/icons";
import { Reveal } from "@/components/motion/Reveal";
import { FOOTER_COLUMNS } from "@/lib/content";

const LINK_CLASS =
  "inline-block py-1 text-[15px] text-as-muted transition-colors hover:text-as-red";

/**
 * Footer — the site's closing editorial beat: an oversized Fraunces
 * headline beside the wordmark, three link columns pulled straight from
 * `FOOTER_COLUMNS`, and a hairline-divided legal row. Runs on `bg-as-ink`
 * (matching `Hero`/`Collaborate`, the other ink sections) with red kept to
 * accents only — link-hover color, the column labels, the bottom-bar mark.
 *
 * 21st.dev sourcing: searched "large editorial footer with link columns and
 * headline" (--type c --limit 6) -> Detailed Footer (ui-layouts, id 18186),
 * Footer Privilege (ui-layouts, id 18183), Footer with Newsletter (hfroget,
 * id 14466). Used **id 18186** as the structural basis — a dark footer with
 * a brand block, N link columns, and a bottom legal/copyright bar, which is
 * exactly this section's shape. Hand-adapted rather than installed
 * verbatim: dropped its email-newsletter form entirely (no newsletter copy
 * or endpoint exists in `content.ts`, and "content fixed" rules out
 * inventing a new CTA); swapped its plain text-badge brand block for the
 * real wordmark (`Logo`) plus the brief's mandatory oversized Fraunces
 * "Clean. Legal. Compliant." headline wrapped in `Reveal`; replaced its
 * zinc-950/zinc-400 palette with this project's `as-ink` background,
 * white-opacity text scale, and `as-red` hover/label accents; and swapped
 * its raw `<a>` internal links for `next/link` where `FOOTER_COLUMNS`
 * hrefs are internal routes (matching the convention already used in
 * `Navbar.tsx`), keeping plain `<a>` only for the `#`-anchor placeholders.
 * No framer-motion in the source, so nothing needed converting there.
 *
 * The "Get in Touch" CTA and its `#collaborate` target are unchanged from
 * the pre-redesign footer (that anchor is `Collaborate.tsx`'s `Section
 * id="collaborate"`), preserved as existing content per the task's
 * content-fixed constraint.
 */
export function Footer() {
  return (
    <footer className="border-t border-as-line bg-as-canvas">
      <div className="as-container grid gap-14 py-20 sm:py-24 lg:grid-cols-12 lg:gap-8 lg:py-28">
        {/* Brand block: wordmark, headline, CTA */}
        <div className="lg:col-span-5">
          <Link href="/" className="inline-flex">
            <Logo variant="black" className="h-8" />
          </Link>

          <Reveal
            as="h2"
            y={24}
            className="font-display mt-8 text-[40px] leading-[1.05] tracking-[-0.03em] text-as-ink sm:text-[52px] lg:text-[60px]"
          >
            Clean. Legal.
            <br />
            Compliant.
          </Reveal>

          <Button href="#collaborate" variant="primary" className="mt-10">
            Get in Touch
          </Button>
        </div>

        {/* Link columns, pulled from FOOTER_COLUMNS */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:col-span-7 lg:gap-8">
          {FOOTER_COLUMNS.map((col, i) => (
            <Reveal as="div" y={20} delay={0.06 * i} key={col.heading}>
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-as-red">
                {col.heading}
              </h3>
              <ul className="mt-6 space-y-1">
                {col.links.map((link) => {
                  const isInternal = link.href.startsWith("/");
                  const content = (
                    <>
                      {link.strong && (
                        <span className="font-semibold text-as-ink">{link.strong} </span>
                      )}
                      {link.label}
                    </>
                  );
                  return (
                    <li key={link.label}>
                      {isInternal ? (
                        <Link href={link.href} className={LINK_CLASS}>
                          {content}
                        </Link>
                      ) : (
                        <a href={link.href} className={LINK_CLASS}>
                          {content}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Legal / copyright row */}
      <div className="border-t border-as-line">
        <div className="as-container flex flex-col-reverse items-center gap-4 py-8 sm:flex-row sm:justify-between">
          <p className="text-sm text-as-muted">
            © Alliance Street Consultancy 2025 All Rights Reserved.
          </p>
          <Logo variant="black" className="h-7 w-auto" />
        </div>
      </div>
    </footer>
  );
}
