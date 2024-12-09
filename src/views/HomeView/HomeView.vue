<script lang="ts" setup>
import InfiniteGallery from '@/views/HomeView/InfiniteGallery.vue';
import TheLogo from '@/components/TheLogo.vue';
import gsap from 'gsap';
import { onMounted, useTemplateRef } from 'vue';

const theLogoRef = useTemplateRef('the-logo');

onMounted(() => {
  gsap.fromTo(
    theLogoRef.value?.logoRef || null,
    { opacity: 0 },
    { opacity: 1, duration: 1.2 }
  );
});
</script>

<template>
  <main>
    <div class="fixed inset-0 flex h-screen w-full items-center justify-center">
      <h1 class="text-[10vw] font-bold uppercase">
        <span class="sr-only">Lorem Ipsum</span>
        <TheLogo ref="the-logo" class="h-auto w-[60vw]" />
      </h1>
    </div>
    <InfiniteGallery />
  </main>
</template>
