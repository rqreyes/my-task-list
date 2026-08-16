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
  Container,
  IconButton,
  Stack,
  TextField,
  useTheme,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";

import { SnackbarText } from "@/app/components/general/SnackbarText";

interface IFormValues {
  taskList: { isCompleted: boolean; title: string }[];
}

const defaultValues: IFormValues = {
  taskList: [
    { isCompleted: false, title: "My first task" },
    { isCompleted: true, title: "Completed task" },
    { isCompleted: false, title: "" },
  ],
};

export default function Home() {
  // hooks
  // ------------------------------------------------------------
  const {
    control,
    handleSubmit,
    formState: { errors },
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

  // form submission
  // ------------------------------------------------------------
  const onSubmit = async (formValues: IFormValues) => {
    try {
      // TODO: update database
      console.log(formValues);

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
          <CardContent>
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
                startIcon={<SaveIcon />}
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
