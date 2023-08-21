import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  onConfirm: () => void;
  hasTextInput?: boolean;
}

const CustomModal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  description,
  onConfirm,
  hasTextInput,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <>
            {description && { description }}
            {hasTextInput && (
              <TextField
                sx={{ width: "700px" }}
                multiline
                minRows={5}
                fullWidth
                variant="outlined"
              />
            )}
          </>
        </DialogContentText>
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
