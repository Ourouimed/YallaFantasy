export const formatDateTime = (value) => {
  const date = new Date(value);
  return date.toISOString().slice(0, 19).replace("T", " ");
};
