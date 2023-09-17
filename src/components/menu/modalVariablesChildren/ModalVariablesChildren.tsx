import React, { useState } from "react";
import { TextField, Button, Divider, Typography, InputAdornment } from "@mui/material";

type ModalChildrenProps = {
  handleDollarRate: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleLaborCost: (event: React.ChangeEvent<HTMLInputElement>) => void;
  dollarRateValue: string;
  laborCostValue: string;
  handleDollarRateSubmit: () => void;
  handleLaborCostSubmit: () => void;
  dollarRateTxt?: string;
  laborCostTxt?: string;
};

const ModalChildren: React.FC<ModalChildrenProps> = ({
  handleDollarRate,
  handleLaborCost,
  dollarRateValue,
  laborCostValue,
  handleDollarRateSubmit,
  handleLaborCostSubmit,
  dollarRateTxt,
  laborCostTxt,
}) => {
  return (
    <div className="modal-wrapper">
      <div className="mb-5 modal-inputs">
        <Typography className="mb-4">{dollarRateTxt}</Typography>
        <div>
          <TextField
            sx={{ width: "8rem" }}
            size="small"
            label="Cotización dólar"
            name="dollarRate"
            type="number"
            inputProps={{
              min: 0,
            }}
            defaultValue={dollarRateValue}
            onChange={handleDollarRate}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography>$</Typography>
                </InputAdornment>
              ),
            }}
          />
          <Button className="modal-buttons" onClick={handleDollarRateSubmit}>
            Enviar
          </Button>
        </div>
      </div>
      <Divider sx={{ width: "100%" }} />
      <div className="mt-5 modal-inputs">
        <Typography className="mb-4">{laborCostTxt}</Typography>
        <div>
          <TextField
            sx={{ width: "8rem" }}
            size="small"
            label="Mano de obra"
            name="laborCost"
            type="number"
            inputProps={{
              min: 0,
            }}
            helperText="* Valor hora"
            defaultValue={laborCostValue}
            onChange={handleLaborCost}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography>$</Typography>
                </InputAdornment>
              ),
            }}
          />
          <Button className="modal-buttons" onClick={handleLaborCostSubmit}>
            Enviar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModalChildren;
