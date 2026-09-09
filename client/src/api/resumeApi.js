import axiosInstance from "./axiosInstance";

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append("resume", file);
  const response = await axiosInstance.post("/resumes", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getResumes = async () => {
  const response = await axiosInstance.get("/resumes");
  return response.data;
};

export const deleteResume = async (id) => {
  const response = await axiosInstance.delete(`/resumes/${id}`);
  return response.data;
};

/**
 * Downloads a resume as a blob and triggers browser save dialog.
 * Uses axiosInstance so the JWT Authorization header is attached.
 */
export const downloadResume = async (id, originalName) => {
  const response = await axiosInstance.get(`/resumes/${id}/download`, {
    responseType: "blob",
  });
  const url = URL.createObjectURL(new Blob([response.data]));
  const a = document.createElement("a");
  a.href = url;
  a.download = originalName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};
