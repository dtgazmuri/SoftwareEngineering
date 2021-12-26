import { toast } from "react-toastify";


  const notifySuccess = () =>
  toast.success("Success!", {
    position: "bottom-right",
    autoClose: 5000,
    id:"success-card",
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
const notifyError = () =>
  toast.error("Error: something went wrong", {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
const notifyBalance = () =>
  toast.warn("Balance insufficient!", {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
const notifyQuantity = () =>
  toast.warn("Maximum quantity reached!", {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

export  {notifyBalance,notifyQuantity, notifyError, notifySuccess}