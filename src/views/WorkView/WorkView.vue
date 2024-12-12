<script setup lang="ts">
import InfiniteProjectsList from './InfiniteProjectsList.vue';
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue';
import { useProjectGroups } from '@/composables/use-project-groups';
import type { Project } from '@/types';
import { useLenis } from '@/composables/use-lenis';
import TransitionPanel from '@/components/TransitionPanel.vue';

const { projectGroups } = useProjectGroups();
const { injectLenis } = useLenis();

const lenis = injectLenis();

const workRef = useTemplateRef('work');
const hoveredProject = ref<Project | null>(null);

const cursorPosition = ref({ x: 0, y: 0 });
const coverPosition = ref({ x: 0, y: 0 });

let animationFrameId: number | null = null;

const updateCursorPosition = (event: MouseEvent) => {
  cursorPosition.value = { x: event.pageX, y: event.pageY };
};

const updateCoverPosition = () => {
  const EASE_FACTOR = 0.08;
  coverPosition.value.x +=
    (cursorPosition.value.x - coverPosition.value.x) * EASE_FACTOR;
  coverPosition.value.y +=
    (cursorPosition.value.y - coverPosition.value.y) * EASE_FACTOR;

  animationFrameId = requestAnimationFrame(updateCoverPosition);
};

const handleMouseEnterProject = (project: Project) => {
  hoveredProject.value = project;
};

const handleMouseLeaveProject = () => {
  hoveredProject.value = null;
};

onMounted(() => {
  lenis.scrollTo(0);
  animationFrameId = requestAnimationFrame(updateCoverPosition);
});

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>

<template>
  <TransitionPanel />
  <main
    ref="work"
    @mousemove="updateCursorPosition"
    class="absolute flex h-screen w-full flex-col justify-center overflow-hidden"
  >
    <InfiniteProjectsList
      v-for="(projectsGroup, index) in projectGroups"
      :key="index"
      :projects="projectsGroup"
      :hovered-project="hoveredProject"
      :cover-position="coverPosition"
      :observer-target="workRef"
      :is-reversed="index % 2 === 1"
      :initial-animation-delay="index * 0.2"
      @mouse-enter-project="handleMouseEnterProject"
      @mouse-leave-project="handleMouseLeaveProject"
    />
  </main>
</template>
