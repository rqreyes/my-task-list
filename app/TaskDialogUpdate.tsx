import { Edit as EditIcon, Close as CloseIcon } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  CircularProgress,
  DialogActions,
  Stack,
  TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import useSWRMutation from "swr/mutation";

import { DialogContainer } from "@/app/components/general/DialogContainer";
import { SnackbarText } from "@/app/components/general/SnackbarText";
import { fetcherTrigger } from "@/app/utils/fetchers";
import { defaultValues, IFormValues, ITaskItem } from "@/app/page";

interface ITaskDialogUpdateProps {
  handleDialogClose: () => void;
  isDialogOpen: boolean;
  taskItem: ITaskItem;
}

export const TaskDialogUpdate = ({
  handleDialogClose,
  isDialogOpen,
  taskItem,
}: ITaskDialogUpdateProps) => {
  // fetching, mutation, and revalidation
  // ------------------------------------------------------------
  const { isMutating, trigger } = useSWRMutation(
    `/api/task${taskItem.id}`,
    fetcherTrigger,
  );

  // other hooks
  // ------------------------------------------------------------
  const {
    clearErrors,
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues,
    mode: "onBlur",
  });
  const IsCompletedWatch = useWatch({ control, name: "isCompleted" });
  const { enqueueSnackbar } = useSnackbar();

  // side effects
  // ------------------------------------------------------------
  useEffect(() => {
    if (isDialogOpen) {
      reset({ isCompleted: taskItem.isCompleted, title: taskItem.title });
    }
  }, [clearErrors, isDialogOpen, reset, taskItem]);

  // form submission
  // ------------------------------------------------------------
  const onSubmit = async (formValues: IFormValues) => {
    try {
      // TODO: update database
      console.log("formValues: ", formValues);
      // await trigger({
      //   body: formValues,
      //   method: "PATCH",
      // });

      enqueueSnackbar(
        <SnackbarText>
          <strong>{formValues.title}</strong> task has been updated
        </SnackbarText>,
        {
          variant: "success",
        },
      );
      handleDialogClose();
    } catch (error) {
      if (error instanceof Error) {
        enqueueSnackbar(
          <SnackbarText>
            <strong>{error.message}</strong>
          </SnackbarText>,
          {
            persist: true,
            variant: "error",
          },
        );
      }

      throw error;
    }
  };

  // render
  // ------------------------------------------------------------
  return (
    <DialogContainer
      handleDialogClose={handleDialogClose}
      isDialogOpen={isDialogOpen}
      text="Update task"
    >
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
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
                      textDecoration: IsCompletedWatch
                        ? "line-through"
                        : "none",
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
            disabled={Object.keys(errors).length > 0 || isMutating}
            startIcon={
              isMutating ? <CircularProgress size="1rem" /> : <EditIcon />
            }
            type="submit"
            variant="contained"
          >
            Update task
          </Button>
        </DialogActions>
      </form>
    </DialogContainer>
  );
};
