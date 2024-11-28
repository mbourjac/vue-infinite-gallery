<script setup lang="ts">
import { RouterLink, type RouterLinkProps } from 'vue-router';

const { to } = defineProps<{
  to: RouterLinkProps['to'];
}>();
</script>

<template>
  <RouterLink :to="to" class="pointer-events-auto p-2"><slot /></RouterLink>
</template>
