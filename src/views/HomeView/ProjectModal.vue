<script lang="ts" setup>
import type { Project } from '@/types';
import { useTemplateRef } from 'vue';

defineProps<{
  openedProject: Project;
}>();

const modalBackgroundRef = useTemplateRef('modal-background');
const modalRef = useTemplateRef('modal');

defineExpose({
  modalBackgroundRef,
  modalRef,
});

const emit = defineEmits(['closeModal']);
</script>

<template>
  <div class="fixed inset-0 flex items-end">
    <div
      ref="modal-background"
      @click="emit('closeModal')"
      class="absolute inset-0 bg-black/40"
    ></div>
    <div
      ref="modal"
      class="relative z-10 h-[calc(100vh-4rem)] w-full rounded-t-3xl bg-white px-[8vw] py-[12vh]"
    >
      <button @click="emit('closeModal')" class="absolute right-0 top-0 p-6">
        Close
      </button>
      <div class="flex h-full gap-[8vw]">
        <img
          :src="openedProject.coverUrl"
          class="aspect-[4/5] h-full rounded-2xl object-cover"
        />
        <div>
          <div class="flex w-[80%] flex-col gap-12 pt-[6vh]">
            <div class="flex flex-col gap-4">
              <h2 class="text-[4vw] font-bold leading-none">
                {{ openedProject.title }}
              </h2>
              <h3 class="text-[1.75vw] font-medium">
                {{ openedProject.tagline }}
              </h3>
            </div>
            <p>{{ openedProject.description }}</p>
            <RouterLink
              :to="{ name: 'project', params: { slug: openedProject.id } }"
              class="w-fit rounded-full bg-zinc-200 px-4 py-2 text-sm transition-colors hover:bg-black hover:text-zinc-100"
            >
              View full project
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
