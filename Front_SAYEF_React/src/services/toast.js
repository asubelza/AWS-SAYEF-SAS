import { toast } from "react-toastify";

const baseOptions = {
  pauseOnHover: true,
  draggable: true,
};

export const notifySuccess = (message, options = {}) =>
  toast.success(message, { ...baseOptions, ...options });

export const notifyError = (message, options = {}) =>
  toast.error(message, { ...baseOptions, ...options });

export const notifyInfo = (message, options = {}) =>
  toast.info(message, { ...baseOptions, ...options });

export const notifyWarning = (message, options = {}) =>
  toast.warn(message, { ...baseOptions, ...options });
