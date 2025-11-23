export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
}

export interface Note {
  id: string;
  userId: string;
  title?: string;
  content: string;
  category: string;
  dateAdded: string;
  dateEdited?: string;
}

export interface Category {
  id: string;
  name: string;
  userId: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, username: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (email: string, username: string, password?: string) => Promise<boolean>;
  loading: boolean;
}

