import { Close as CloseIcon } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
} from "@mui/material";
import { ReactNode } from "react";

interface IDialogContainerProps {
  children: ReactNode;
  handleDialogClose: () => void;
  isDialogOpen: boolean;
  text: string;
}

export const DialogContainer = ({
  children,
  handleDialogClose,
  isDialogOpen,
  text,
}: IDialogContainerProps) => {
  // render
  // ------------------------------------------------------------
  return (
    <Dialog fullWidth onClose={handleDialogClose} open={isDialogOpen}>
      <Stack
        direction="row"
        sx={{
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <DialogTitle>{text}</DialogTitle>
        <IconButton onClick={handleDialogClose} sx={{ m: 1 }}>
          <CloseIcon />
        </IconButton>
      </Stack>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};
