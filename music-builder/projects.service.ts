// import { Injectable, HostListener } from '@angular/core';
import { MusicProject, MusicProjectData } from './project';

// @Injectable({
//   providedIn: 'root',
// })
export class ProjectsService {
  private static ProjectLocalStorage = 'projects-local-storage';

  private projects: MusicProject[] = [];

  constructor() {
    this.loadProjects();
    window.onbeforeunload = () => this.saveProjects();
  }

  public getProjectById(id: string) {
    return this.projects.find(project => project.getId() === id);
  }

  public getProjects() {
    return this.projects;
  }

  /** Creates a new project */
  public newProject() {
    this.projects.push(new MusicProject());
  }

  public deleteProject(id: string) {
    this.projects = this.projects.filter(proj => proj.getId() !== id);
  }

  /** Loads projects from local storage. */
  private loadProjects() {
    const rawData = localStorage.getItem(ProjectsService.ProjectLocalStorage);
    if (rawData) {
      const projectsData = JSON.parse(rawData) as MusicProjectData[] || [];
      this.projects = projectsData.sort((a, b) => a.lastEdited < b.lastEdited ? 1 : -1).map(
        projectData => new MusicProject(projectData),
      );
    }
  }

  /** Saves projects to local storage. */
  private saveProjects() {
    localStorage.setItem(
      ProjectsService.ProjectLocalStorage,
      JSON.stringify(this.projects.map(project => project.toData())),
    );
  }
}
