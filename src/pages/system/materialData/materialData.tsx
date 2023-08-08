import { Typography } from "@mui/material";
import { ReactNode } from "react";
import { BaseMaterial } from "../../../interfaces/form/FormInterfaces";
import "./materialData.css";

const MaterialData = (prop: any) => {
  const { material } = prop;

  return (
    <div className="col-lg-12">
      <div className="material-data-container">
        <div className="col-lg-2 col-sm-2 data-div">
          <Typography fontWeight="700" variant="body1">
            {`Marca: ${material.brand}`}
          </Typography>
        </div>
        <div className="col-lg-2 col-sm-2 data-div">
          <Typography fontWeight="700" variant="body1">
            {`Tipo: ${material.type}`}
          </Typography>
        </div>
        <div className="col-lg-2 col-sm-2 data-div">
          <Typography fontWeight="700" variant="body1">
            {`Composición: ${material.component}`}
          </Typography>
        </div>
        <div className="col-lg-2 col-sm-2 data-div">
          <Typography fontWeight="700" variant="body1">
            {`Precio de presentación: $ ${material.presentationPrice}`}
          </Typography>
        </div>
        <div className="col-lg-2 col-sm-2 data-div">
          <Typography fontWeight="700" variant="body1">
            {`Cantidad de presentación: ${material.presentationQuantity}`}
          </Typography>
        </div>
        <div className="col-lg-2 col-sm-2 data-div">
          <Typography fontWeight="700" variant="body1">
            {`Unidad de presentación: ${material.presentationUnit}`}
          </Typography>
        </div>
        <div className="col-lg-2 col-sm-2 data-div">
          <Typography fontWeight="700" variant="body1">
            {`Fecha del precio: ${material.priceDate}`}
          </Typography>
        </div>
        <div className="col-lg-2 col-sm-2 data-div">
          <Typography fontWeight="700" variant="body1">
            {`Vida útil: ${material.potLife}`}
          </Typography>
        </div>
        <div className="col-lg-2 col-sm-2 data-div">
          <Typography fontWeight="700" variant="body1">
            {`Temp min aplicable: ${material.minApplicableTemp}`}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default MaterialData;
