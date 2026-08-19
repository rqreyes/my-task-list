"use client";

import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  CircularProgress,
  Container,
  IconButton,
  Stack,
  TextField,
  useTheme,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { Controller, useForm, useWatch } from "react-hook-form";
import useSWR from "swr";

import { SnackbarText } from "@/app/components/general/SnackbarText";
import { useState } from "react";
import { ErrorPage } from "@/app/components/general/ErrorPage";
import { LoadingPage } from "@/app/components/general/LoadingPage";
import { fetcherGet, fetcherTrigger } from "@/app/utils/fetchers";
import { TaskDialogUpdate } from "@/app/TaskDialogUpdate";
import useSWRMutation from "swr/mutation";

enum DialogList {
  Delete,
  Update,
}
export interface IFormValues {
  id: number;
  isCompleted: boolean;
  title: string;
}
export interface ITaskItem {
  id: number;
  isCompleted: boolean;
  title: string;
}
export interface IResTaskList {
  taskList: ITaskItem[];
}

export const defaultValues: IFormValues = {
  id: 0,
  isCompleted: false,
  title: "",
};

export default function Home() {
  // state
  // ------------------------------------------------------------
  const [dialogCurrent, setDialogCurrent] = useState({
    dialogItem: 0,
    task: {
      id: 0,
      isCompleted: false,
      title: "",
    },
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // hooks
  // ------------------------------------------------------------
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues,
    mode: "onBlur",
  });
  const IsCompletedWatch = useWatch({ control, name: "isCompleted" });
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

  // fetching, mutation, and revalidation
  // ------------------------------------------------------------
  const {
    data,
    error,
  }: {
    data: IResTaskList;
    error: Error | undefined;
  } = useSWR("/api/tasks", fetcherGet);
  const { isMutating, trigger } = useSWRMutation("/api/tasks", fetcherTrigger);

  // logic
  // ------------------------------------------------------------
  if (error) return <ErrorPage />;
  if (!data) return <LoadingPage />;

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
          Task list has been <strong>added</strong>
        </SnackbarText>,
        {
          variant: "success",
        },
      );
      reset({ isCompleted: false, title: "" });
    } catch (error) {
      if (error instanceof Error) {
        enqueueSnackbar(<strong>{error.message}</strong>, {
          persist: true,
          variant: "error",
        });
      }

      throw error;
    }
  };

  // render
  // ------------------------------------------------------------
  return (
    <>
      <Container
        component="main"
        maxWidth="sm"
        sx={{ display: "flex", flexDirection: "column", gap: theme.spacing(2) }}
      >
        <Card>
          <CardHeader title="My Task List" sx={{ textAlign: "center" }} />
          <CardContent
            sx={{ height: "40vh", overflow: "auto", pl: theme.spacing(4) }}
          >
            {data.taskList.map(({ id, isCompleted, title }) => {
              return (
                <Stack direction="row" key={id} spacing={1}>
                  <TextField
                    defaultValue={title}
                    fullWidth
                    multiline
                    slotProps={{
                      htmlInput: {
                        readOnly: true,
                        style: {
                          textDecoration: isCompleted ? "line-through" : "none",
                        },
                      },
                    }}
                    variant="standard"
                  />
                  <IconButton>
                    <EditIcon
                      onClick={() => {
                        setDialogCurrent({
                          dialogItem: DialogList.Update,
                          task: { id, isCompleted, title },
                        });
                        setIsDialogOpen(true);
                      }}
                    />
                  </IconButton>
                  <IconButton>
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              );
            })}
          </CardContent>
        </Card>
        <Card>
          <CardContent>
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
              <Stack
                direction="row"
                sx={{ justifyContent: "flex-end", mt: theme.spacing(1) }}
              >
                <Button
                  disabled={Object.keys(errors).length > 0 || isMutating}
                  startIcon={
                    isMutating ? <CircularProgress size="1rem" /> : <AddIcon />
                  }
                  type="submit"
                  variant="contained"
                >
                  Add task
                </Button>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Container>

      {/* update dialog */}
      <TaskDialogUpdate
        handleDialogClose={() => setIsDialogOpen(false)}
        isDialogOpen={
          dialogCurrent.dialogItem === DialogList.Update && isDialogOpen
        }
        taskItem={dialogCurrent.task}
      />
    </>
  );
}
