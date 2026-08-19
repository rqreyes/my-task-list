import { Close as CloseIcon } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  CircularProgress,
  DialogActions,
  Stack,
  TextField,
} from "@mui/material";
import { ReactElement } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";

export interface IFormValues {
  id: number;
  isCompleted: boolean;
  title: string;
}
interface ITaskDialogFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<IFormValues, any, IFormValues>;
  errors: FieldErrors<IFormValues>;
  handleDialogClose: () => void;
  isCompletedWatch: boolean;
  isMutating: boolean;
  isSubmitDisabled: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  submitIcon: ReactElement<any, any>;
  submitText: string;
}

export const defaultValues: IFormValues = {
  id: 0,
  isCompleted: false,
  title: "",
};
export const TaskDialogForm = ({
  control,
  errors,
  handleDialogClose,
  isCompletedWatch,
  isMutating,
  isSubmitDisabled,
  submitIcon,
  submitText,
}: ITaskDialogFormProps) => {
  // render
  // ------------------------------------------------------------
  return (
    <>
      <Stack direction="row" spacing={1}>
        <Controller
          control={control}
          name="isCompleted"
          render={({ field: { value, ...field } }) => (
            <Checkbox {...field} checked={value} />
          )}
        />
        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <TextField
              {...field}
              error={Boolean(errors.title)}
              fullWidth
              helperText={errors.title?.message}
              label=""
              multiline
              required
              slotProps={{
                htmlInput: {
                  style: {
                    textDecoration: isCompletedWatch ? "line-through" : "none",
                  },
                },
              }}
              variant="standard"
            />
          )}
          rules={{
            required: "Title is required",
            validate: (value) => {
              return Boolean(value.trim()) || "Title is required";
            },
          }}
        />
      </Stack>
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
          disabled={isSubmitDisabled}
          startIcon={isMutating ? <CircularProgress size="1rem" /> : submitIcon}
          type="submit"
          variant="contained"
        >
          {submitText}
        </Button>
      </DialogActions>
    </>
  );
};
