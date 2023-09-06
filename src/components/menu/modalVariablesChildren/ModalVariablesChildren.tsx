import React, { useState } from "react";
import { TextField, Button, Divider, Typography } from "@mui/material";

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
  dollarRateTxt: dollarText,
  laborCostTxt: laborCost,
}) => {
  return (
    <div className="modal-wrapper">
      <div className="mb-5 modal-inputs">
        <Typography className="mb-4">{dollarText}</Typography>
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
          />
          <Button className="modal-buttons" onClick={handleDollarRateSubmit}>
            Enviar
          </Button>
        </div>
      </div>
      <Divider sx={{ width: "100%" }} />
      <div className="mt-5 modal-inputs">
        <Typography className="mb-4">{laborCost}</Typography>
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
            defaultValue={laborCostValue}
            onChange={handleLaborCost}
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
