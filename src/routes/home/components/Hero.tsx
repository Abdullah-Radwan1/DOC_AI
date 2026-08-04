import { motion } from "framer-motion";

function AnimatedText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const letters = text.split("");

  return (
    <h1 className={className} aria-label={text}>
      {letters.map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.35,
            delay: index * 0.018,
            ease: "easeOut",
          }}
          className="inline-block whitespace-pre"
        >
          {char}
        </motion.span>
      ))}
    </h1>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-border/70 bg-white p-6 sm:p-10 lg:p-12 shadow-[0_24px_60px_rgba(15,23,42,0.06)]">
      <div className="hero-glow absolute inset-0 rounded-[28px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.12),transparent_30%),radial-gradient(circle_at_left,rgba(16,185,129,0.10),transparent_25%)] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center space-y-6">
        <AnimatedText
          text="AI-Powered Compliance Review for Contracts & Policies"
          className="mx-auto max-w-5xl text-4xl font-extrabold tracking-tight leading-tight text-foreground sm:text-5xl lg:text-6xl"
        />

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="mx-auto max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg"
        >
          Upload a contract, policy, or agreement, tell Docky what compliance
          rule or risk area to check, and get back an executive summary,
          findings, clause references, and actionable recommendations.
        </motion.p>
      </div>
    </section>
  );
}
