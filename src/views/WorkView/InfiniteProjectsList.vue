<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue';
import gsap from 'gsap';
import Observer from 'gsap/Observer';
import { createHorizontalLoop } from '@/lib/gsap';
import type { Position, Project } from '@/types';
import ProjectCover from './ProjectCover.vue';

const { observerTarget, isReversed, initialAnimationDelay } = defineProps<{
  projects: Project[];
  hoveredProject: Project | null;
  coverPosition: Position;
  observerTarget: HTMLElement | null;
  isReversed?: boolean;
  initialAnimationDelay: number;
}>();

const emit = defineEmits(['mouseEnterProject', 'mouseLeaveProject']);

const projectRefs = useTemplateRef('list-item');
const containerRefs = useTemplateRef<HTMLElement[] | null>('container');

let gsapContext: gsap.Context | null = null;

onMounted(() => {
  const projects = projectRefs.value;

  if (!projects) return;

  gsapContext = gsap.context(() => {
    gsap.fromTo(
      containerRefs.value,
      { yPercent: 100 },
      {
        yPercent: 0,
        duration: 1.2,
        delay: initialAnimationDelay,
        ease: 'custom2',
        stagger: 0.05,
      }
    );

    const loop = createHorizontalLoop(projects, { repeat: -1 });
    const slow = gsap.to(loop, { timeScale: 0, duration: 0.5 });

    loop.time(8); // Offset projects list on page load.
    loop.timeScale(0);

    Observer.create({
      target: observerTarget,
      type: 'pointer,touch,wheel',
      wheelSpeed: -1,
      onChange: (self) => {
        const timeScaleValue =
          Math.abs(self.deltaX) > Math.abs(self.deltaY)
            ? -self.deltaX
            : -self.deltaY;

        loop.timeScale(isReversed ? -timeScaleValue : timeScaleValue);
        slow.invalidate().restart();
      },
    });
  });
});

onUnmounted(() => {
  gsapContext?.revert();
  gsapContext = null;
});
</script>

<template>
  <ul class="grid grid-flow-col py-[0.5vw] transition-opacity duration-500">
    <li
      v-for="project in projects"
      ref="list-item"
      :key="project.id"
      @mouseenter="emit('mouseEnterProject', project)"
      @mouseleave="emit('mouseLeaveProject')"
      :class="[
        'pt-[0.55vw] text-white mix-blend-difference transition-opacity duration-500',
        {
          'opacity-50':
            hoveredProject !== null && hoveredProject.id !== project.id,
          'z-10': hoveredProject?.id === project.id,
        },
      ]"
    >
      <RouterLink
        :to="{ name: 'project', params: { slug: project.id } }"
        class="block overflow-hidden"
      >
        <div
          ref="container"
          :class="[
            'mx-[2vw] grid grid-flow-col overflow-hidden whitespace-nowrap',
          ]"
        >
          <h2 class="text-[5vw] font-bold leading-none">
            {{ project.title }}
          </h2>
          <ul class="flex flex-col">
            <li
              v-for="(tag, index) in project.tags"
              :key="index"
              class="text-[1vw] leading-none"
            >
              {{ tag }}
            </li>
          </ul>
        </div>
      </RouterLink>
    </li>
    <ProjectCover
      :url="hoveredProject?.coverUrl ?? null"
      :position="coverPosition"
    />
  </ul>
</template>
