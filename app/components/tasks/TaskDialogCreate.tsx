import { Add as AddIcon } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import useSWRMutation from "swr/mutation";

import { DialogContainer } from "@/app/components/general/DialogContainer";
import { SnackbarText } from "@/app/components/general/SnackbarText";
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
  const isCompletedWatch = useWatch({ control, name: "isCompleted" });
  const { enqueueSnackbar } = useSnackbar();

  // side effects
  // ------------------------------------------------------------
  useEffect(() => {
    if (isDialogOpen) {
      clearErrors();
      reset({ isCompleted: false, title: "" });
    }
  }, [clearErrors, isDialogOpen, reset]);

  // form submission
  // ------------------------------------------------------------
  const onSubmit = async (formValues: IFormValues) => {
    try {
      // TODO: update database
      console.log("formValues: ", formValues);
      // await trigger({
      //   body: formValues,
      //   method: "POST",
      // });

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
      text="Add task"
    >
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <TaskDialogForm
          control={control}
          errors={errors}
          handleDialogClose={handleDialogClose}
          isCompletedWatch={isCompletedWatch}
          isMutating={isMutating}
          isSubmitDisabled={Object.keys(errors).length > 0 || isMutating}
          submitIcon={<AddIcon />}
          submitText="Add task"
        />
      </form>
    </DialogContainer>
  );
};
