"use client";

import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Restore as RestoreIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
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
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import useSWR from "swr";

import { SnackbarText } from "@/app/components/general/SnackbarText";
import { useEffect } from "react";
import { ErrorPage } from "@/app/components/general/ErrorPage";
import { LoadingPage } from "@/app/components/general/LoadingPage";
import useSWRMutation from "swr/mutation";
import { fetcherGet, fetcherTrigger } from "@/app/utils/fetchers";

interface IFormValues {
  taskList: { isCompleted: boolean; title: string }[];
}
interface IResTaskItem {
  id: number;
  isCompleted: boolean;
  title: string;
}
interface IResTaskList {
  taskList: IResTaskItem[];
}

const defaultValues: IFormValues = {
  taskList: [{ isCompleted: false, title: "" }],
};

export default function Home() {
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
  const { append, fields, remove } = useFieldArray({
    control,
    name: "taskList",
  });
  const taskListWatch = useWatch({ control, name: "taskList" });
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

  // side effects
  // ------------------------------------------------------------
  useEffect(() => {
    if (data) {
      reset({
        taskList: data.taskList,
      });
    }
  }, [data, reset]);

  // logic
  // ------------------------------------------------------------
  if (error) return <ErrorPage />;
  if (!data) return <LoadingPage />;

  // form submission
  // ------------------------------------------------------------
  const onSubmit = async (formValues: IFormValues) => {
    try {
      await trigger({
        body: formValues,
        method: "POST",
      });

      enqueueSnackbar(
        <SnackbarText>
          Task list has been <strong>saved</strong>
        </SnackbarText>,
        {
          variant: "success",
        },
      );
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
    <Container component="main" maxWidth="sm">
      <Card>
        <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
          <CardHeader title="My Task List" sx={{ textAlign: "center" }} />
          <CardContent sx={{ height: "40vh", overflow: "auto" }}>
            {fields.map((field, index) => {
              return (
                <Stack direction="row" key={field.id} spacing={1}>
                  <Controller
                    control={control}
                    name={`taskList.${index}.isCompleted`}
                    render={({ field: { value, ...field } }) => (
                      <Checkbox {...field} checked={value} />
                    )}
                  />
                  <Controller
                    control={control}
                    name={`taskList.${index}.title`}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        error={Boolean(errors.taskList?.[index]?.title)}
                        fullWidth
                        helperText={errors.taskList?.[index]?.title?.message}
                        label=""
                        multiline
                        required
                        slotProps={{
                          htmlInput: {
                            style: {
                              textDecoration: taskListWatch[index]?.isCompleted
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
                  <IconButton>
                    <DeleteIcon onClick={() => remove(index)} />
                  </IconButton>
                </Stack>
              );
            })}
          </CardContent>
          <CardActions
            sx={{
              justifyContent: "space-between",
              pb: theme.spacing(2),
              px: theme.spacing(2),
            }}
          >
            <Button
              onClick={() => append({ isCompleted: false, title: "" })}
              startIcon={<AddIcon />}
              type="button"
              variant="contained"
            >
              Add task
            </Button>
            <Stack direction="row" spacing={1}>
              <Button
                onClick={() => {
                  enqueueSnackbar(
                    <SnackbarText>
                      Task list has been <strong>reset</strong>
                    </SnackbarText>,
                    {
                      variant: "success",
                    },
                  );
                }}
                startIcon={<RestoreIcon />}
                type="button"
                variant="outlined"
              >
                Reset
              </Button>
              <Button
                disabled={isMutating}
                startIcon={
                  isMutating ? <CircularProgress size="1rem" /> : <SaveIcon />
                }
                type="submit"
                variant="contained"
              >
                Save
              </Button>
            </Stack>
          </CardActions>
        </form>
      </Card>
    </Container>
  );
}
