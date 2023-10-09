export const download = (fileName: string, data: string) => {
  const a = document.createElement("a");
  a.href = "data:application/octet-stream," + encodeURIComponent(data);
  a.download = fileName;
  a.click();
};
