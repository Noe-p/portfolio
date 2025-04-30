/* eslint-disable @typescript-eslint/no-explicit-any */
export async function getGsap() {
  const { gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');

  // Bypass TS en castant vers any
  if (!(gsap as any).core.globals().ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  return { gsap, ScrollTrigger };
}
