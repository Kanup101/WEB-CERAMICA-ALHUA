import es from "../../../messages/es.json";
import en from "../../../messages/en.json";
import de from "../../../messages/de.json";
import fr from "../../../messages/fr.json";
import ko from "../../../messages/ko.json";
import zh from "../../../messages/zh-CN.json";
import type { Locale } from "./config";

export type MessageKey = keyof typeof es;
export type Messages = Record<MessageKey, string>;
export const dictionaries: Record<Locale, Messages> = { es, en, de, fr, ko, "zh-CN": zh };
export function translator(messages: Messages) {
  return (key: MessageKey, values: Record<string, string | number> = {}) => {
    const text = messages[key];
    if (typeof text !== "string") throw new Error(`Missing translation: ${key}`);
    return text.replace(/\{(\w+)\}/g, (match, name: string) => String(values[name] ?? match));
  };
}
export const getTranslator = (locale: Locale) => translator(dictionaries[locale]);
