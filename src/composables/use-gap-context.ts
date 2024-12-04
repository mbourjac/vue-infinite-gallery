import { onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';

export function useGsapContext(callback: () => void) {
  let gsapContext: gsap.Context | null = null;

  onMounted(() => {
    gsapContext = gsap.context(callback);
  });

  onUnmounted(() => {
    gsapContext?.revert();
    gsapContext = null;
  });
}
