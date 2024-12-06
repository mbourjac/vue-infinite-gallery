import { computed } from 'vue';
import { useRoute, type RouteRecordNameGeneric } from 'vue-router';

export function usePageBackground(routeName?: RouteRecordNameGeneric) {
  const route = useRoute();

  const backgroundColor = computed(() => {
    const name = routeName ?? route.name;
    switch (name) {
      case 'work':
        return '#d6dae3';
      default:
        return '#ffffff';
    }
  });

  return backgroundColor;
}
