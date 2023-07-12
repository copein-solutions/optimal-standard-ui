import * as React from "react";
import { Typography, Divider, Button, Box } from "@mui/material";

type CustomDividerProps = {
  text: string;
  hasButtons?: boolean;
  addButtonText?: string;
  deleteButtonText?: string;
  addButtonHandleEvent?: () => void;
  deleteButtonHandleEvent?: () => void;
};

const CustomDivider: React.FC<CustomDividerProps> = ({
  text,
  hasButtons,
  addButtonText,
  deleteButtonText,
  addButtonHandleEvent,
  deleteButtonHandleEvent,
}) => {
  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" alignItems="flex-end">
        <Typography
          fontWeight="bold"
          align="left"
          variant="subtitle1"
          component="div"
          sx={{ mt: 3, marginRight: "auto" }}
        >
          {text}
        </Typography>
        {hasButtons && (
          <>
            <Button
              variant="contained"
              sx={{ height: "25px", marginBottom: "4px", mr: "4px" }}
              onClick={addButtonHandleEvent}
              color="success"
            >
              {addButtonText}
            </Button>
            <Button
              variant="text"
              sx={{ height: "25px", marginBottom: "4px" }}
              onClick={deleteButtonHandleEvent}
              color="error"
            >
              {deleteButtonText}
            </Button>
          </>
        )}
      </Box>
      <Divider />
    </Box>
  );
};

export default CustomDivider;
