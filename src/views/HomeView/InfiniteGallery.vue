<script lang="ts" setup>
import {
  onMounted,
  ref,
  useTemplateRef,
  onUnmounted,
  nextTick,
  computed,
} from 'vue';
import gsap from 'gsap';
import CustomEase from 'gsap/CustomEase';
import { useLenis } from '@/composables/use-lenis';
import { useGalleryProjects } from '@/composables/use-gallery-projects';
import { PROJECTS } from '@/constants';
import ProjectModal from './ProjectModal.vue';
import type { Project } from '@/types';

const { injectLenis } = useLenis();
const lenis = injectLenis();

const { galleryProjects, IMAGES_PER_COLUMN } = useGalleryProjects();
const openedProjectId = ref<Project['id'] | null>(null);

const galleryHeight = ref(0);
const scrollOffset = ref(0);

const openedProject = computed(() =>
  PROJECTS.find(({ id }) => id === openedProjectId.value)
);

const columnRefs = useTemplateRef('columns');
const imageRefs = useTemplateRef('images');
const projectModalRef = useTemplateRef('project-modal');

const handleOpenProjectModal = async (id: string) => {
  openedProjectId.value = id;

  await nextTick();

  if (!projectModalRef.value) return;

  gsap.fromTo(
    projectModalRef.value.modalBackgroundRef,
    { opacity: 0 },
    { opacity: 1, duration: 0.4, ease: 'power2.out' }
  );

  gsap.fromTo(
    projectModalRef.value.modalRef,
    { y: '100%' },
    { y: '0%', duration: 0.5, ease: 'power3.out' }
  );
};

const handleCloseProjectModal = () => {
  if (!projectModalRef.value) return;

  gsap.to(projectModalRef.value.modalBackgroundRef, {
    opacity: 0,
    duration: 0.4,
    ease: 'power2.in',
  });

  gsap.to(projectModalRef.value.modalRef, {
    y: '100%',
    duration: 0.5,
    ease: 'power3.in',
    onComplete: () => {
      openedProjectId.value = null;
    },
  });
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && openedProjectId.value !== null) {
    handleCloseProjectModal();
  }
};

onMounted(() => {
  const setupScroll = () => {
    lenis.options.infinite = true;
    lenis.scrollTo(0);
  };

  const updateGalleryHeight = (images: HTMLButtonElement[]) => {
    const imagesHeight = images[0].offsetHeight;

    galleryHeight.value = imagesHeight * IMAGES_PER_COLUMN + window.innerHeight;
  };

  // Determine the column the image belongs to
  const getImageColumnIndex = (imageIndex: number) =>
    Math.floor(imageIndex / (IMAGES_PER_COLUMN * 2));

  // Determine the position of the image within its column
  const getImageIndexInColumn = (imageIndex: number) =>
    imageIndex % (IMAGES_PER_COLUMN * 2);

  const setupImagePositions = (images: HTMLButtonElement[]) => {
    images.forEach((image, imageIndex) => {
      const columnIndex = getImageColumnIndex(imageIndex);
      const indexInColumn = getImageIndexInColumn(imageIndex);
      const yPercentOffset = columnIndex % 2 === 0 ? 10 : 560;

      gsap.set(image, {
        yPercent: indexInColumn * 100 + yPercentOffset,
      });
    });
  };

  const updateColumnPositions = (columns: HTMLDivElement[]) => {
    scrollOffset.value =
      (lenis.dimensions.scrollHeight -
        lenis.dimensions.height -
        lenis.actualScroll) *
      2;
    requestAnimationFrame(() => updateColumnPositions(columns));
  };

  const revealImages = (images: HTMLButtonElement[]) => {
    // Initially set all images to be invisible and scaled down
    gsap.set(images, {
      opacity: 0,
      scale: 0.4,
    });

    CustomEase.create('popping', '.16,1,.3,1');

    images.forEach((image, imageIndex) => {
      const columnIndex = getImageColumnIndex(imageIndex);
      const indexInColumn = getImageIndexInColumn(imageIndex);
      const animationOrder =
        columnIndex * IMAGES_PER_COLUMN + (indexInColumn % 2);

      gsap.to(image, {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        delay: 0.8 + 0.025 * animationOrder,
        ease: 'popping',
      });
    });
  };

  const init = () => {
    const columns = columnRefs.value;
    const images = imageRefs.value;

    if (!columns || !images) return;

    setupScroll();
    updateGalleryHeight(images);
    setupImagePositions(images);
    requestAnimationFrame(() => updateColumnPositions(columns));
    revealImages(images);

    window.addEventListener('resize', () => updateGalleryHeight(images));
    document.addEventListener('keydown', handleKeydown);
  };

  init();
});

onUnmounted(() => {
  lenis.options.infinite = false;
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div class="px-[4vw]">
    <div
      class="grid grid-cols-4 gap-[4vw] overflow-hidden"
      :style="{ height: galleryHeight + 'px' }"
    >
      <div
        v-for="(column, columnIndex) in galleryProjects"
        :key="columnIndex"
        ref="columns"
        class="relative"
        :style="{
          transform:
            columnIndex % 2 === 1
              ? `translateY(-${scrollOffset}px)`
              : 'initial',
        }"
      >
        <button
          v-for="({ id, title, coverUrl }, itemIndex) in column"
          :key="`${columnIndex}-${itemIndex}`"
          ref="images"
          @click="() => handleOpenProjectModal(id)"
          class="group absolute w-full py-[2vw]"
        >
          <div
            class="aspect-[4/5] overflow-hidden rounded-xl transition-transform duration-700 ease-[cubic-bezier(0.07,0.51,0.18,0.96)] group-hover:scale-90"
          >
            <img
              :src="coverUrl"
              :alt="title"
              class="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.07,0.51,0.18,0.96)] group-hover:scale-125"
            />
          </div>
        </button>
      </div>
    </div>
  </div>
  <ProjectModal
    v-if="openedProject"
    ref="project-modal"
    :openedProject="openedProject"
    @close-modal="handleCloseProjectModal"
  />
</template>
