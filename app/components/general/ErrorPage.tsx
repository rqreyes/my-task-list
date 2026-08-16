import { Alert, Container } from "@mui/material";

export const ErrorPage = () => {
  // render
  // ------------------------------------------------------------
  return (
    <Container component="main" maxWidth="sm">
      <Alert severity="error">
        Well this is awkward...seems like something went wrong on our end :&#40;
        <br />
        Please try refreshing the page
      </Alert>
    </Container>
  );
};
