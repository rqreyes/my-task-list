import { CircularProgress, Container } from "@mui/material";

export const LoadingPage = () => {
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
      <CircularProgress />
    </Container>
  );
};
