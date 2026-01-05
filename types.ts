
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface Topic {
  id: number;
  title: string;
  icon: string;
}

export enum AppMode {
  CURRICULUM = 'CURRICULUM',
  CHAT = 'CHAT'
}
