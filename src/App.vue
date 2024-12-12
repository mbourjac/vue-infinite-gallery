<script setup lang="ts">
import { RouterView } from 'vue-router';
import AppLayout from '@/layouts/AppLayout/AppLayout.vue';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import CustomEase from 'gsap/CustomEase';
import Observer from 'gsap/Observer';

gsap.registerPlugin(ScrollTrigger, CustomEase, Observer);

CustomEase.create('custom1', '.16,1,.3,1');
CustomEase.create('custom2', '.04,.64,.17,1');
CustomEase.create('custom3', '.4,0,0,1');
</script>

<template>
  <AppLayout>
    <RouterView />
  </AppLayout>
</template>
