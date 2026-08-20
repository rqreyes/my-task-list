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
import { TaskDialogDelete } from "@/app/components/tasks/TaskDialogDelete";
import { TaskDialogUpdate } from "@/app/components/tasks/TaskDialogUpdate";
import { IDataTaskItem } from "@/app/types/tasks";
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
    data: IDataTaskItem[];
    error: Error | undefined;
  } = useSWR("/api/tasks", fetcherGet);

  // logic
  // ------------------------------------------------------------
  if (error) return <ErrorPage />;
  if (!data) return <LoadingPage />;

  const handleDialogClose = () => setIsDialogOpen(false);
  const dataTaskList = data.map(({ id, is_completed, title }) => {
    return {
      id,
      isCompleted: is_completed,
      title,
    };
  });

  // render
  // ------------------------------------------------------------
  return (
    <>
      <Container component="main" maxWidth="sm">
        <Card>
          <CardHeader title="My Task List" />
          <CardContent>
            <List>
              {dataTaskList.map(({ id, isCompleted, title }) => {
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
                      <DeleteIcon
                        onClick={() => {
                          setDialogCurrent({
                            dialogItem: DialogList.Delete,
                            taskItem: { id, isCompleted, title },
                          });
                          setIsDialogOpen(true);
                        }}
                      />
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

      {/* delete dialog */}
      <TaskDialogDelete
        handleDialogClose={handleDialogClose}
        isDialogOpen={
          dialogCurrent.dialogItem === DialogList.Delete && isDialogOpen
        }
        taskItem={dialogCurrent.taskItem}
      />
    </>
  );
}
