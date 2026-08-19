import { Edit as EditIcon } from "@mui/icons-material";
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
import { ITaskItem } from "@/app/page";
import { fetcherTrigger } from "@/app/utils/fetchers";

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
    `/api/task/${taskItem.id}`,
    fetcherTrigger
  );

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
  const dialogActionText = "Update task";

  // side effects
  // ------------------------------------------------------------
  useEffect(() => {
    if (isDialogOpen) {
      clearErrors();
      reset({
        id: taskItem.id,
        isCompleted: taskItem.isCompleted,
        title: taskItem.title,
      });
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
          submitIcon={<EditIcon />}
          submitText={dialogActionText}
        />
      </form>
    </DialogContainer>
  );
};
