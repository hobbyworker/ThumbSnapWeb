import type en from './locales/en';

export type MessageKey = keyof typeof en;
export type Messages = Readonly<Record<MessageKey, string>>;
