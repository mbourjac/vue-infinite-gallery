<script setup lang="ts">
import InfiniteProjectsList from './InfiniteProjectsList.vue';
import { onMounted, ref, useTemplateRef } from 'vue';
import { useProjectGroups } from '@/composables/use-project-groups';
import type { Project } from '@/types';
import { useLenis } from '@/composables/use-lenis';

const { projectGroups } = useProjectGroups();
const { injectLenis } = useLenis();

const lenis = injectLenis();

const workRef = useTemplateRef('work');
const hoveredProject = ref<Project | null>(null);

const handleMouseEnterProject = (project: Project) => {
  hoveredProject.value = project;
};

const handleMouseLeaveProject = () => {
  hoveredProject.value = null;
};

onMounted(() => {
  lenis.scrollTo(0);
});
</script>

<template>
  <main
    ref="work"
    class="absolute flex h-screen w-full flex-col justify-center overflow-hidden"
  >
    <InfiniteProjectsList
      v-for="(projectsGroup, index) in projectGroups"
      :key="index"
      :projects="projectsGroup"
      :hovered-project="hoveredProject"
      :observer-target="workRef"
      :is-reversed="index % 2 === 1"
      @mouse-enter-project="handleMouseEnterProject"
      @mouse-leave-project="handleMouseLeaveProject"
    />
  </main>
</template>
