import { ref } from 'vue';
import { PROJECTS } from '../constants';
import type { Project } from '../types';

export const useGalleryProjects = () => {
  const IMAGES_PER_COLUMN = 6;

  const createGalleryProjects = (projects: Project[]) => {
    const galleryProjects: Project[][] = [];

    for (let i = 0; i < projects.length; i += IMAGES_PER_COLUMN) {
      const slice = projects.slice(i, i + IMAGES_PER_COLUMN);
      // Repeat the items by concatenating the slice with itself
      galleryProjects.push([...slice, ...slice]);
    }

    return galleryProjects;
  };

  const galleryProjects = ref(createGalleryProjects(PROJECTS));

  return { galleryProjects, IMAGES_PER_COLUMN };
};
