import { Add as AddIcon } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import useSWRMutation from "swr/mutation";

import { DialogContainer } from "@/app/components/general/DialogContainer";
import { SnackbarText } from "@/app/components/general/SnackbarText";
import { TaskDialogActions } from "@/app/components/tasks/TaskDialogActions";
import { TaskDialogForm } from "@/app/components/tasks/TaskDialogForm";
import {
  defaultValues,
  IFormValues,
} from "@/app/components/tasks/TaskDialogForm";
import { fetcherTrigger } from "@/app/utils/fetchers";

interface ITaskDialogCreateProps {
  handleDialogClose: () => void;
  isDialogOpen: boolean;
}

export const TaskDialogCreate = ({
  handleDialogClose,
  isDialogOpen,
}: ITaskDialogCreateProps) => {
  // fetching, mutation, and revalidation
  // ------------------------------------------------------------
  const { isMutating, trigger } = useSWRMutation("/api/tasks", fetcherTrigger);

  // hooks
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
  const isCompletedWatch = useWatch({ control, name: "isCompleted" });
  const { enqueueSnackbar } = useSnackbar();

  // logic
  // ------------------------------------------------------------
  const dialogActionText = "Create task";

  // side effects
  // ------------------------------------------------------------
  useEffect(() => {
    if (isDialogOpen) {
      clearErrors();
      reset({ id: 0, isCompleted: false, title: "" });
    }
  }, [clearErrors, isDialogOpen, reset]);

  // form submission
  // ------------------------------------------------------------
  const onSubmit = async (formValues: IFormValues) => {
    try {
      await trigger({
        body: { taskItem: formValues },
        method: "POST",
      });

      enqueueSnackbar(
        <SnackbarText>
          <strong>{formValues.title}</strong> task has been added
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
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <TaskDialogForm
          control={control}
          errors={errors}
          isCompletedWatch={isCompletedWatch}
        />
        <TaskDialogActions
          handleDialogClose={handleDialogClose}
          errors={errors}
          isMutating={isMutating}
          submitIcon={<AddIcon />}
          submitText={dialogActionText}
        />
      </form>
    </DialogContainer>
  );
};
