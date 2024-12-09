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
import { useLenis } from '@/composables/use-lenis';
import { PROJECTS } from '@/constants';
import ProjectModal from './ProjectModal.vue';
import type { Project } from '@/types';
import { useProjectGroups } from '@/composables/use-project-groups';

const { injectLenis } = useLenis();
const lenis = injectLenis();

const { projectGroups, PROJECTS_PER_GROUP } = useProjectGroups();
const openedProjectId = ref<Project['id'] | null>(null);

const galleryHeight = ref(0);
const scrollOffset = ref(0);

const openedProject = computed(() =>
  PROJECTS.find(({ id }) => id === openedProjectId.value)
);

const groupRefs = useTemplateRef('groups');
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

    galleryHeight.value =
      imagesHeight * PROJECTS_PER_GROUP + window.innerHeight;
  };

  // Determine the group the image belongs to
  const getImageGroupIndex = (imageIndex: number) =>
    Math.floor(imageIndex / (PROJECTS_PER_GROUP * 2));

  // Determine the position of the image within its group
  const getImageIndexInGroup = (imageIndex: number) =>
    imageIndex % (PROJECTS_PER_GROUP * 2);

  const setupImagePositions = (images: HTMLButtonElement[]) => {
    images.forEach((image, imageIndex) => {
      const groupIndex = getImageGroupIndex(imageIndex);
      const indexInGroup = getImageIndexInGroup(imageIndex);
      const yPercentOffset = groupIndex % 2 === 0 ? 10 : 560;

      gsap.set(image, {
        yPercent: indexInGroup * 100 + yPercentOffset,
      });
    });
  };

  const updateAccessibilityAttributes = (images: HTMLButtonElement[]) => {
    images.forEach((image) => {
      const { top, bottom } = image.getBoundingClientRect();
      const isVisible = top >= 0 && bottom <= window.innerHeight;

      image.tabIndex = isVisible ? 0 : -1;
      image.setAttribute('aria-hidden', isVisible ? 'false' : 'true');
    });
  };

  const updateGroupPositions = (
    groups: HTMLDivElement[],
    images: HTMLButtonElement[]
  ) => {
    groups.forEach((group, groupIndex) => {
      if (groupIndex % 2 === 1) {
        group.style.transform = `translateY(-${scrollOffset.value}px)`;
      }
    });

    scrollOffset.value =
      (lenis.dimensions.scrollHeight -
        lenis.dimensions.height -
        lenis.actualScroll) *
      2;

    updateAccessibilityAttributes(images);
    requestAnimationFrame(() => updateGroupPositions(groups, images));
  };

  const revealImages = (images: HTMLButtonElement[]) => {
    // Initially set all images to be invisible and scaled down
    gsap.set(images, {
      opacity: 0,
      scale: 0.4,
    });

    images.forEach((image, imageIndex) => {
      const groupIndex = getImageGroupIndex(imageIndex);
      const indexInGroup = getImageIndexInGroup(imageIndex);
      const animationOrder =
        groupIndex * PROJECTS_PER_GROUP + (indexInGroup % 2);

      gsap.to(image, {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        delay: 0.25 + 0.025 * animationOrder,
        ease: 'custom1',
      });
    });
  };

  const init = () => {
    const groups = groupRefs.value;
    const images = imageRefs.value;

    if (!groups || !images) return;

    setupScroll();
    updateGalleryHeight(images);
    setupImagePositions(images);
    requestAnimationFrame(() => updateGroupPositions(groups, images));
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
        v-for="(projectsGroup, projectsGroupIndex) in projectGroups"
        :key="projectsGroupIndex"
        ref="groups"
        class="relative"
        :style="{
          transform:
            projectsGroupIndex % 2 === 1
              ? `translateY(-${scrollOffset}px)`
              : 'initial',
        }"
      >
        <button
          v-for="({ id, title, coverUrl }, projectIndex) in projectsGroup"
          :key="`${projectsGroupIndex}-${projectIndex}`"
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
