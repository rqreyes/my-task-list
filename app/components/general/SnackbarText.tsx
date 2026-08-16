import { Typography } from "@mui/material";
import { ReactNode } from "react";

interface ISnackbarTextProps {
  children: ReactNode;
}

export const SnackbarText = ({ children }: ISnackbarTextProps) => {
  // render
  // ------------------------------------------------------------
  return (
    <Typography
      sx={{
        fontSize: 14,
      }}
    >
      {children}
    </Typography>
  );
};
