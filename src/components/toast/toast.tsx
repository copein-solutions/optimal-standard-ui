import { useState, useEffect } from "react";
import { Alert, AlertTitle, Typography } from "@mui/material";
import "./toast.css";

type ToastType = "error" | "success" | "warning";

type ToastProps = {
  type: ToastType;
  message: string;
  open: boolean;
  onClose: () => void;
};

const Toast: React.FC<ToastProps> = ({ type, message, open, onClose }) => {
  const [showToast, setShowToast] = useState(open);

  useEffect(() => {
    setShowToast(open);
  }, [open]);

    useEffect(() => {
      let timeoutId: NodeJS.Timeout;
      if (showToast) {
        timeoutId = setTimeout(() => {
          setShowToast(false);
          onClose();
        }, 5000);
      }
      return () => {
        clearTimeout(timeoutId);
      };
    }, [showToast, onClose]);

  const handleCloseToast = () => {
    setShowToast(false);
    onClose();
  };

  const getAlertSeverity = () => {
    switch (type) {
      case "error":
        return "error";
      case "success":
        return "success";
      case "warning":
        return "warning";
      default:
        return "info";
    }
  };

  return (
    <>
      {showToast && (
        <div className="toast-container">
          <div className="toast-content">
            <Alert severity={getAlertSeverity()} onClose={handleCloseToast}>
              <Typography variant="subtitle1">{message}</Typography>
            </Alert>
          </div>
        </div>
      )}
    </>
  );
};

export default Toast;
