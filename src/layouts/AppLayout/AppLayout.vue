<script setup lang="ts">
import TheLogo from '@/components/TheLogo.vue';
import { useLenis } from '@/composables/use-lenis';
import HeaderLink from './HeaderLink.vue';

const { initLenis } = useLenis();

initLenis();
</script>

<template>
  <div class="bg-white">
    <header
      class="pointer-events-none fixed top-0 z-20 flex w-full items-center justify-between px-6 py-3 text-white mix-blend-difference"
    >
      <HeaderLink :to="{ name: 'home' }">
        <span class="sr-only">Home</span>
        <TheLogo class="h-7 w-auto" />
      </HeaderLink>
      <nav>
        <ul class="flex gap-32 text-2xl font-semibold">
          <li>
            <HeaderLink :to="{ name: 'work' }">Work</HeaderLink>
          </li>
          <li>
            <HeaderLink :to="{ name: 'about' }">About</HeaderLink>
          </li>
          <li>
            <HeaderLink :to="{ name: 'contact' }">Contact</HeaderLink>
          </li>
        </ul>
      </nav>
    </header>
    <slot />
  </div>
</template>
