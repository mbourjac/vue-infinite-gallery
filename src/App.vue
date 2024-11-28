<script setup lang="ts">
import { RouterView } from 'vue-router';
import AppLayout from '@/layouts/AppLayout/AppLayout.vue';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import CustomEase from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, CustomEase);
</script>

<template>
  <AppLayout>
    <RouterView />
  </AppLayout>
</template>
