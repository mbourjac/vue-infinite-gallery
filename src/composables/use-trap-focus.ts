import { onMounted, onUnmounted, ref, type Ref } from 'vue';

export const useTrapFocus = (targetRef: Ref<HTMLElement | null>) => {
  const focusableElements = ref<HTMLElement[]>([]);
  const lastFocusedElement = ref<HTMLElement | null>(null);

  const trapFocus = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;

    const firstElement = focusableElements.value[0];
    const lastElement =
      focusableElements.value[focusableElements.value.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };

  onMounted(() => {
    const targetElement = targetRef.value;

    if (!targetElement) return;

    // Save the currently focused element
    lastFocusedElement.value = document.activeElement as HTMLElement | null;

    // Get all focusable elements inside the target element
    focusableElements.value = Array.from(
      targetElement.querySelectorAll(
        'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
      )
    );

    // Focus the first element in the target element
    focusableElements.value[0].focus();

    document.addEventListener('keydown', trapFocus);
  });

  onUnmounted(() => {
    // Restore focus to the previously focused element
    lastFocusedElement.value?.focus();

    document.removeEventListener('keydown', trapFocus);
  });
};
