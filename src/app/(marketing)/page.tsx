import { ScrollReveal } from '@/components/animations/ScrollReveal';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <ScrollReveal animation="fade-up">
          <h1 className="text-6xl font-bold tracking-tight text-white">Ales</h1>
          <p className="mt-4 max-w-xl text-lg text-neutral-400">
            Enterprise hardware solutions for businesses in TRNC. Cameras, access points, laptops
            — sourced and supported locally.
          </p>
        </ScrollReveal>
      </section>
    </div>
  );
}
