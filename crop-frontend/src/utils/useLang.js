import translations from "./Language";

export const useLang = () => {
  const lang = localStorage.getItem("lang") || "en";

  return translations[lang];
};