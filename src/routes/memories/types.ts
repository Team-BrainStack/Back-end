export type ErrorResult = {
  message: string;
  code: string;
};

export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: ErrorResult };

export type CreateMemoryInput = {
  userId: string;
  content: string;
  title?: string;
  tags?: string[];
};

export type UpdateMemoryInput = {
  content?: string;
  title?: string;
  tags?: string[];
};
