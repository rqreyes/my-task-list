"use client";

import {
  Add as AddIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useState } from "react";
import useSWR from "swr";

import { ErrorPage } from "@/app/components/general/ErrorPage";
import { LoadingPage } from "@/app/components/general/LoadingPage";
import { TaskDialogCreate } from "@/app/components/tasks/TaskDialogCreate";
import { TaskDialogUpdate } from "@/app/components/tasks/TaskDialogUpdate";
import { fetcherGet } from "@/app/utils/fetchers";

enum DialogList {
  Create,
  Delete,
  Update,
}
export interface ITaskItem {
  id: number;
  isCompleted: boolean;
  title: string;
}
export interface ITaskList {
  taskList: ITaskItem[];
}

export default function Home() {
  // state
  // ------------------------------------------------------------
  const [dialogCurrent, setDialogCurrent] = useState({
    dialogItem: 0,
    taskItem: {
      id: 0,
      isCompleted: false,
      title: "",
    },
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // fetching, mutation, and revalidation
  // ------------------------------------------------------------
  const {
    data,
    error,
  }: {
    data: ITaskList;
    error: Error | undefined;
  } = useSWR("/api/tasks", fetcherGet);

  // logic
  // ------------------------------------------------------------
  if (error) return <ErrorPage />;
  if (!data) return <LoadingPage />;

  const handleDialogClose = () => setIsDialogOpen(false);

  // render
  // ------------------------------------------------------------
  return (
    <>
      <Container component="main" maxWidth="sm">
        <Card>
          <CardHeader title="My Task List" />
          <CardContent>
            <List>
              {data.taskList.map(({ id, isCompleted, title }) => {
                return (
                  <ListItem disablePadding key={id}>
                    <ListItemIcon>
                      {isCompleted ? (
                        <CheckBoxIcon />
                      ) : (
                        <CheckBoxOutlineBlankIcon />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={title}
                      sx={{
                        textDecoration: isCompleted ? "line-through" : "none",
                      }}
                    />
                    <IconButton>
                      <EditIcon
                        onClick={() => {
                          setDialogCurrent({
                            dialogItem: DialogList.Update,
                            taskItem: { id, isCompleted, title },
                          });
                          setIsDialogOpen(true);
                        }}
                      />
                    </IconButton>
                    <IconButton>
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                );
              })}
            </List>
          </CardContent>
          <Divider variant="middle" />
          <CardActions>
            <Button
              onClick={() => {
                setDialogCurrent({
                  dialogItem: DialogList.Create,
                  taskItem: { id: 0, isCompleted: false, title: "" },
                });
                setIsDialogOpen(true);
              }}
              startIcon={<AddIcon />}
              variant="contained"
            >
              Create task
            </Button>
          </CardActions>
        </Card>
      </Container>

      {/* create dialog */}
      <TaskDialogCreate
        handleDialogClose={handleDialogClose}
        isDialogOpen={
          dialogCurrent.dialogItem === DialogList.Create && isDialogOpen
        }
      />

      {/* update dialog */}
      <TaskDialogUpdate
        handleDialogClose={handleDialogClose}
        isDialogOpen={
          dialogCurrent.dialogItem === DialogList.Update && isDialogOpen
        }
        taskItem={dialogCurrent.taskItem}
      />
    </>
  );
}
