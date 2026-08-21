import { Delete as DeleteIcon } from "@mui/icons-material";
import { DialogContentText, Typography, useTheme } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { mutate } from "swr";
import useSWRMutation from "swr/mutation";

import { DialogContainer } from "@/app/components/general/DialogContainer";
import { SnackbarText } from "@/app/components/general/SnackbarText";
import { TaskDialogActions } from "@/app/components/tasks/TaskDialogActions";
import {
  defaultValues,
  IFormValues,
} from "@/app/components/tasks/TaskDialogForm";
import { ITaskItem } from "@/app/page";
import { checkResponseError } from "@/app/types/checkResponseError";
import { fetcherTrigger } from "@/app/utils/fetchers";

interface ITaskDialogDeleteProps {
  handleDialogClose: () => void;
  isDialogOpen: boolean;
  taskItem: ITaskItem;
}

export const TaskDialogDelete = ({
  handleDialogClose,
  isDialogOpen,
  taskItem,
}: ITaskDialogDeleteProps) => {
  // fetching, mutation, and revalidation
  // ------------------------------------------------------------
  const { isMutating, trigger } = useSWRMutation(
    `/api/task/${taskItem.id}`,
    fetcherTrigger
  );

  // hooks
  // ------------------------------------------------------------
  const { handleSubmit, reset } = useForm({
    defaultValues,
  });
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  // logic
  // ------------------------------------------------------------
  const dialogActionText = "Delete task";

  // side effects
  // ------------------------------------------------------------
  useEffect(() => {
    if (isDialogOpen) {
      reset({
        id: taskItem.id,
        isCompleted: taskItem.isCompleted,
        title: taskItem.title,
      });
    }
  }, [isDialogOpen, reset, taskItem]);

  // form submission
  // ------------------------------------------------------------
  const onSubmit = async ({ id, title }: IFormValues) => {
    const body = {
      id,
    };

    try {
      // update database
      const response = await trigger({
        body,
        method: "DELETE",
      });

      // check if response is an error
      checkResponseError(response);

      // update UI
      mutate("/api/tasks");

      enqueueSnackbar(
        <SnackbarText>
          <strong>{title}</strong> task has been deleted
        </SnackbarText>,
        {
          variant: "success",
        }
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
          }
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
      text={dialogActionText}
    >
      <DialogContentText sx={{ mb: theme.spacing(1) }}>
        <Typography component="span">
          Are you sure you want to delete <strong>{taskItem.title}</strong>{" "}
          task?
        </Typography>
      </DialogContentText>
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <TaskDialogActions
          handleDialogClose={handleDialogClose}
          errors={{}}
          isMutating={isMutating}
          submitIcon={<DeleteIcon />}
          submitText={dialogActionText}
        />
      </form>
    </DialogContainer>
  );
};
