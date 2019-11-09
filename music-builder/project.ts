import * as uuid from 'uuid';
import { EditableObject } from './editableObject';
import { Song, SongData, SongTheme, ProjectTheme } from './song';

/** Represents the data for a MusicProject when it is in a JSON savable form */
export interface MusicProjectData {
  id: string;
  name: string;
  created: string;
  lastEdited: string;
  theme: ProjectTheme;
  songs: Array<SongData>;
}

export class MusicProject extends EditableObject  {
  /** The songs contained within this project */
  private songs: Array<Song>;
  /** The theme of this project. this is used as the default value for the theme of each individual song.
   * However, a song may override this with its own theme.*/
  private theme: ProjectTheme;

  /** Constructs a project. If a data source is provided the project will load that. Otherwise, it will create a new project */
  constructor(data?: MusicProjectData) {
    super();
    this.id = data ? data.id : uuid();
    this.name = data ? data.name : 'New Project';
    this.created = data ? new Date(data.created) : new Date();
    this.lastEdited = data ? new Date(data.lastEdited) : new Date();
    this.theme = data ? data.theme : SongTheme.Fantasy;
    this.songs = data ? data.songs.sort((a, b) => a.lastEdited < b.lastEdited ? 1 : -1).map(songData => new Song(songData)) : [];
    for (const song of this.songs) {
      song.setProject(this);
    }
  }

  /** Converts the class into a simple object that can be saved as JSON */
  public toData(): MusicProjectData {
    this.modified = false;
    return {
      id: this.id,
      name: this.name,
      created: this.created.toString(),
      lastEdited: this.lastEdited.toString(),
      theme: this.theme,
      songs: this.songs.map(song => song.toData())
    };
  }

  /** Removes a song from the project (this will not automatically stop it from playing) */
  public deleteSong(id: string) {
    this.songs = this.songs.filter(song => song.getId() !== id);
  }

  /** Adds a song to the project */
  public addSong() {
    const newSong = new Song();
    newSong.setProject(this);
    this.songs.push(newSong);
  }

  /** Returns the list of songs in the project */
  public getSongs() {
    return this.songs;
  }

  /**
   * Returns the theme of the project. This is used as the default value for the theme of each individual song.
   * However, a song may override this with its own theme.
   */
  public getTheme(): ProjectTheme {
    return this.theme;
  }

   /**
   * Sets the theme of the project. This is used as the default value for the theme of each individual song.
   * However, a song may override this with its own theme.
   */
  public setTheme(theme: ProjectTheme) {
    if (theme !== this.theme) {
      this.theme = theme;
      this.markChange();
    }
  }
}
