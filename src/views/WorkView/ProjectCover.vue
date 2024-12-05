<script setup lang="ts">
import type { Position } from '@/types';
import type { RendererElement } from 'vue';
import gsap from 'gsap';

const { url } = defineProps<{
  url: string | null;
  position: Position;
}>();

const DURATION = 0.4;
const INITIAL_OPACITY = 0;
const INITIAL_SCALE = 0.5;
const ANIMATED_OPACITY = 1;
const ANIMATED_SCALE = 1;

const onBeforeEnter = (element: RendererElement) => {
  gsap.set(element, {
    opacity: INITIAL_OPACITY,
    scale: INITIAL_SCALE,
    yPercent: -80,
  });
};

const onEnter = (element: RendererElement, done: () => void) => {
  gsap.to(element, {
    duration: DURATION,
    opacity: ANIMATED_OPACITY,
    scale: ANIMATED_SCALE,
    onComplete: done,
  });
};

const onLeave = (element: RendererElement, done: () => void) => {
  gsap.to(element, {
    duration: DURATION,
    opacity: INITIAL_OPACITY,
    scale: INITIAL_SCALE,
    onComplete: done,
  });
};
</script>

<template>
  <Transition
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @leave="onLeave"
    :css="false"
  >
    <div
      v-if="url"
      class="pointer-events-none absolute aspect-[4/5] w-64 overflow-hidden rounded-2xl"
      :style="{
        top: `${position.y}px`,
        left: `${position.x}px`,
      }"
    >
      <img :src="url" alt="Project cover" class="h-full w-full object-cover" />
    </div>
  </Transition>
</template>
