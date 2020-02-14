import { Song, SongTheme, SongType } from './song';
import { MusicProject } from './project';

describe('Song', () => {
  it('should be instantiable', () => {
    const song = new Song();
    expect(song).toBeDefined();
  });

  it('should use parents theme when set to use parent', () => {
    const song = new Song();
    const project = new MusicProject();
    project.setTheme(SongTheme.Horror);
    song.setProject(project);
    expect(song.getResolvedTheme()).toBe(project.getTheme());
  });

  it('should ignore parents theme when not set to user parent', () => {
    const song = new Song();
    const project = new MusicProject();
    project.setTheme(SongTheme.Horror);
    song.setProject(project);
    song.setTheme(SongTheme.SciFi);
    expect(song.getResolvedTheme()).toBe(SongTheme.SciFi);
  });

  it('should able be to load data', () => {
    const song = new Song({
      created: new Date().toString(),
      lastEdited: new Date().toString(),
      id: '34252343',
      name: 'Test Song',
      theme: SongTheme.Fantasy,
      type: SongType.Boss,
      energy: 1,
      tone: 2,
      seed: '1',
    });
    expect(song).toBeDefined();
    expect(song.getEnergy()).toBe(1);
    expect(song.getTone()).toBe(2);
    expect(song.getTheme()).toBe(SongTheme.Fantasy);
    expect(song.getType()).toBe(SongType.Boss);
    expect(song.getName()).toBe('Test Song');
    expect(song.getId()).toBe('34252343');
  });

  it('should adjust its generated energy', () => {
    const song = new Song();
    let baseArousal = song.getResolvedArousal();
    song.setEnergy(song.getEnergy() + 10);
    expect(song.getResolvedArousal()).toBeGreaterThan(baseArousal);
    song.setType(SongType.Exploration);
    baseArousal = song.getResolvedArousal();
    song.setType(SongType.Boss);
    expect(song.getResolvedArousal()).toBeGreaterThan(baseArousal);
  });
});
