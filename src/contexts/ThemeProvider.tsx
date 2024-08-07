import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useStorage } from "../hooks";

type Theme = "dark" | "light";

type ThemeContextProps = {
  toggleTheme: () => void;
  isDarkTheme: boolean;
};

type ThemeContextProviderProps = {
  children: JSX.Element;
};

const ThemeContext = createContext<ThemeContextProps>({
  toggleTheme: () => {},
  isDarkTheme: false,
});

export const ThemeContextProvider = (props: ThemeContextProviderProps) => {
  const [theme, setTheme] = useState<Theme>();

  const storage = useStorage({});

  const toggleTheme = useCallback(() => {
    setTheme((previousTheme) => (previousTheme === "dark" ? "light" : "dark"));
  }, []);

  useEffect(() => {
    const handleSetInitialTheme = async () => {
      const theme = await storage.get<Theme>("theme");
      setTheme(theme);
    };
    handleSetInitialTheme();
  }, []);

  useEffect(() => {
    const handleUpdateThemeStorage = async () => {
      await storage.set("theme", theme);
    };
    if (theme) {
      handleUpdateThemeStorage();
    }
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        isDarkTheme: theme === "dark",
        toggleTheme,
      }}
    >
      {theme && (
        <div data-testid="theme-provider" className={theme}>
          {props.children}
        </div>
      )}
    </ThemeContext.Provider>
  );
};

export const useThemeProvider = () => useContext(ThemeContext);

export default ThemeContext;
