import Lenis from 'lenis';
import { inject, provide } from 'vue';
import ScrollTrigger from 'gsap/ScrollTrigger';
import gsap from 'gsap';

export const useLenis = () => {
  const initLenis = () => {
    const lenis = new Lenis({
      duration: 1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2.5, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    provide('lenis', lenis);
  };

  const injectLenis = () => {
    const lenis = inject<Lenis>('lenis');

    if (!lenis) {
      throw new Error("lenis hasn't been provided");
    }

    return lenis;
  };

  return { initLenis, injectLenis };
};
