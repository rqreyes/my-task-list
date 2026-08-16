import { CircularProgress, Container, useTheme } from "@mui/material";

export const LoadingPage = () => {
  // hooks
  // ------------------------------------------------------------
  const theme = useTheme();

  // render
  // ------------------------------------------------------------
  return (
    <Container
      component="main"
      sx={{
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <CircularProgress sx={{ color: theme.palette.common.white }} />
    </Container>
  );
};
