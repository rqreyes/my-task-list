import { Close as CloseIcon } from "@mui/icons-material";
import { Button, CircularProgress, DialogActions } from "@mui/material";
import { ReactElement } from "react";
import { FieldErrors } from "react-hook-form";

import { IFormValues } from "@/app/components/tasks/TaskDialogForm";

interface TaskDialogActionsProps {
  handleDialogClose: () => void;
  isMutating: boolean;
  errors: FieldErrors<IFormValues>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  submitIcon: ReactElement<any, any>;
  submitText: string;
}

export const TaskDialogActions = ({
  handleDialogClose,
  isMutating,
  errors,
  submitIcon,
  submitText,
}: TaskDialogActionsProps) => {
  return (
    <DialogActions>
      <Button
        disabled={isMutating}
        startIcon={<CloseIcon />}
        onClick={handleDialogClose}
        type="button"
        variant="outlined"
      >
        Cancel
      </Button>
      <Button
        disabled={Object.keys(errors).length > 0 || isMutating}
        startIcon={isMutating ? <CircularProgress size="1rem" /> : submitIcon}
        type="submit"
        variant="contained"
      >
        {submitText}
      </Button>
    </DialogActions>
  );
};
