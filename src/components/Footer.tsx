import Image from "next/image";
import { LogoMark } from "@/components/icons";
import { FOOTER_COLUMNS } from "@/lib/content";

export function Footer() {
  return (
    <footer>
      {/* Main footer over red -> dark gradient */}
      <div className="bg-gradient-to-b from-[#8a1417] via-[#3a0a0c] to-black pb-16 pt-20">
        <div className="as-container grid gap-12 lg:grid-cols-2">
          {/* Left: logo + CTA */}
          <div>
            <Image
              src="/images/footer-logo.png"
              alt="Alliance Street"
              width={280}
              height={76}
              className="h-9 w-auto"
            />
            <h2 className="mt-8 text-[44px] leading-[1.05] tracking-[-0.03em] text-white sm:text-[56px]">
              Clean. Legal.
              <br />
              Compliant.
            </h2>
            <a
              href="#collaborate"
              className="mt-10 inline-flex rounded-full bg-white px-7 py-3.5 font-semibold text-black transition-transform hover:scale-[1.02]"
            >
              Get in Touch
            </a>
          </div>

          {/* Right: link columns */}
          <div className="grid gap-10 sm:grid-cols-3">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.heading}>
                <h3 className="mb-5 font-semibold text-white">{col.heading}</h3>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-[15px] text-white/70 transition-colors hover:text-white"
                      >
                        {link.strong && (
                          <span className="font-semibold text-white">
                            {link.strong}{" "}
                          </span>
                        )}
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-black py-8">
        <div className="as-container flex items-center justify-between">
          <p className="text-sm text-white/60">
            © Alliance Street Consultancy 2025 All Rights Reserved.
          </p>
          <LogoMark className="h-6 w-auto" />
        </div>
      </div>
    </footer>
  );
}
