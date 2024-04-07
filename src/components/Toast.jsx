import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Toast() {
  const showSuccessToast = () => {
    toast.success("Welcome to the Health Platform!", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  return (
    <>
      <ToastContainer />
      <button onClick={showSuccessToast}>Show Toast</button>
    </>
  );
}

export default Toast;