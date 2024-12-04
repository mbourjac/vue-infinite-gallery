import { ref } from 'vue';
import { PROJECTS } from '../constants';
import type { Project } from '../types';

export const useProjectGroups = () => {
  const PROJECTS_PER_GROUP = 6;

  const createProjectGroups = (projects: Project[]) => {
    const projectGroups: Project[][] = [];

    for (let i = 0; i < projects.length; i += PROJECTS_PER_GROUP) {
      const slice = projects.slice(i, i + PROJECTS_PER_GROUP);
      // Repeat the items by concatenating the slice with itself
      projectGroups.push([...slice, ...slice]);
    }

    return projectGroups;
  };

  const projectGroups = ref(createProjectGroups(PROJECTS));

  return { projectGroups, PROJECTS_PER_GROUP };
};
