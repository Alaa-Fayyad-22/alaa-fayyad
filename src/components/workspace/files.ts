import type { FC } from 'react';
import AboutFile from './files/AboutFile';
import SkillsFile from './files/SkillsFile';
import ProjectsFile from './files/ProjectsFile';
import ExperienceFile from './files/ExperienceFile';
import ContactFile from './files/ContactFile';

export type WsFile = {
  /** Stable id used as the key for tab/open state. */
  id: string;
  /** Filename shown in the tree, tab, minimap and statusbar. */
  name: string;
  /** Optional folder row rendered above this item in the tree. */
  folder?: string;
  /** Tree glyph (◆ populated / ◇ data), matching the reference. */
  icon: string;
  /** Language label for the statusbar. */
  language: string;
  Component: FC;
};

/**
 * The five "files" map 1:1 to the real sections. Order here is the initial tree
 * and tab order; runtime reordering/closing is tracked in state.ts.
 */
export const WS_FILES: WsFile[] = [
  { id: 'about', name: 'about.tsx', icon: '◆', language: 'TypeScript', Component: AboutFile },
  { id: 'skills', name: 'skills.json', icon: '◇', language: 'JSON', Component: SkillsFile },
  { id: 'projects', name: 'index.tsx', folder: 'projects/', icon: '◆', language: 'TypeScript', Component: ProjectsFile },
  { id: 'experience', name: 'experience.log', icon: '◇', language: 'Log', Component: ExperienceFile },
  { id: 'contact', name: 'contact.ts', icon: '◆', language: 'TypeScript', Component: ContactFile },
];

export const WS_FILE_IDS = WS_FILES.map((f) => f.id);
