"use client"

import type { IconButtonProps, BoxProps } from "@chakra-ui/react"
import { IconButton, Skeleton, Box } from "@chakra-ui/react"
import { ThemeProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import * as React from "react"
import { LuMoon, LuSun } from "react-icons/lu"

// Import hooks from separate file to fix Fast Refresh warnings
import {
  useColorMode,
  type ColorMode,
} from "./color-mode-hooks"

// Custom ClientOnly component implementation
const ClientOnly = ({ 
  children, 
  fallback 
}: { 
  children: React.ReactNode; 
  fallback?: React.ReactNode 
}) => {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted ? <>{children}</> : <>{fallback}</>;
};

// Export the ThemeProviderProps as ColorModeProviderProps
export type ColorModeProviderProps = ThemeProviderProps;

// Provider component
export function ColorModeProvider(props: ThemeProviderProps) {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange {...props} />
  );
}

// Export the ColorMode type
export { type ColorMode };

// Icon component
export const ColorModeIcon = React.memo(() => {
  const { colorMode } = useColorMode();
  return colorMode === "dark" ? <LuMoon /> : <LuSun />;
});
ColorModeIcon.displayName = "ColorModeIcon";

// Button component
export type ColorModeButtonProps = Omit<IconButtonProps, "aria-label">;

export const ColorModeButton = React.forwardRef<
  HTMLButtonElement,
  ColorModeButtonProps
>(function ColorModeButton(props, ref) {
  const { toggleColorMode } = useColorMode();
  return (
    <ClientOnly fallback={<Skeleton boxSize="8" />}>
      <IconButton
        onClick={toggleColorMode}
        variant="ghost"
        aria-label="Toggle color mode"
        size="sm"
        ref={ref}
        {...props}
      >
        <ColorModeIcon />
      </IconButton>
    </ClientOnly>
  );
});

// Mode components
export const LightMode = React.forwardRef<HTMLDivElement, BoxProps>(
  function LightMode(props, ref) {
    return (
      <Box
        color="gray.800"
        display="contents"
        className="chakra-theme light"
        ref={ref}
        {...props}
      />
    );
  }
);

export const DarkMode = React.forwardRef<HTMLDivElement, BoxProps>(
  function DarkMode(props, ref) {
    return (
      <Box
        color="whiteAlpha.900"
        display="contents"
        className="chakra-theme dark"
        ref={ref}
        {...props}
      />
    );
  }
);
