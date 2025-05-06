"use client"

import { useTheme } from "next-themes"
import * as React from "react"

// ColorMode related types
export type ColorMode = "light" | "dark";

export interface UseColorModeReturn {
  colorMode: ColorMode;
  setColorMode: (colorMode: ColorMode) => void;
  toggleColorMode: () => void;
}

// Hooks for color mode functionality
export const useColorMode = (): UseColorModeReturn => {
  const { resolvedTheme, setTheme } = useTheme();
  
  const value = React.useMemo(() => {
    const toggleColorMode = () => {
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
    };
    
    return {
      colorMode: (resolvedTheme as ColorMode) || "light",
      setColorMode: setTheme,
      toggleColorMode,
    };
  }, [resolvedTheme, setTheme]);
  
  return value;
};

export const useColorModeValue = <T,>(light: T, dark: T): T => {
  const { colorMode } = useColorMode();
  const value = React.useMemo(() => {
    return colorMode === "dark" ? dark : light;
  }, [colorMode, dark, light]);
  
  return value;
};