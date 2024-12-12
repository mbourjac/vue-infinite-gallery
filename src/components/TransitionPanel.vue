<script setup lang="ts">
import { useTemplateRef, onMounted } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import gsap from 'gsap';
import { usePageBackground } from '@/composables/use-page-background';

const panelRef = useTemplateRef<HTMLElement>('panel');

onMounted(() => {
  gsap.set(panelRef.value, { yPercent: -100 });
});

onBeforeRouteLeave((to, _from, next) => {
  const animationDurationInMs = 800;
  const backgroundColor = usePageBackground(to.name);

  panelRef.value!.style.backgroundColor = backgroundColor.value;

  gsap.to(panelRef.value, {
    yPercent: 0,
    duration: animationDurationInMs / 1000,
    ease: 'custom3',
  });

  setTimeout(() => {
    next();
  }, animationDurationInMs);
});
</script>

<template>
  <div ref="panel" class="fixed top-0 z-30 h-screen w-screen"></div>
</template>
