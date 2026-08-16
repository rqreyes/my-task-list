"use client";

import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { Geist, Geist_Mono } from "next/font/google";
import { SnackbarProvider } from "notistack";

import SnackbarButtonClose from "@/app/components/general/SnackbarButtonClose";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const theme = createTheme({
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        "*": { boxSizing: "border-box" },
        body: {
          background:
            "linear-gradient(0deg,rgba(2, 0, 36, 1) 0%, rgba(9, 9, 121, 1) 35%, rgba(0, 212, 255, 1) 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minHeight: "100vh",
        },
      },
    },
  },
});
const SnackbarAction = (snackbarKey: number | string) => (
  <SnackbarButtonClose snackbarKey={snackbarKey} />
);

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <SnackbarProvider action={SnackbarAction}>
              {children}
            </SnackbarProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
