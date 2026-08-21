// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const checkResponseError = (response: any) => {
  if (response.hasOwnProperty("error")) {
    throw new Error(response.error);
  }
};
