import React, { ReactNode } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  onConfirm: () => void;
  children?: ReactNode;
}

const CustomModal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  description,
  onConfirm,
  children,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
        <div className="m-3 d-flex">{children}</div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={onConfirm} variant="contained" color="primary">
          Aceptar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomModal;
