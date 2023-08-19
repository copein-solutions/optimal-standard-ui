import { Typography } from "@mui/material";
import { BaseMaterial } from "../../../interfaces/form/FormInterfaces";
import { truncateDecimals } from "../../../utils/mathUtils";
import "./materialData.css";

interface materialDataProps {
  material: BaseMaterial | undefined;
}

export const MaterialData: React.FC<materialDataProps> = ({ material }) => {
  const unitPrice = truncateDecimals(Number(material?.unitPrice), 2);
  const unitPricePrefix = `$/${material?.presentationUnit}`;

  return (
    <div className="col-lg-12">
      <div className="material-data-container">
        <div className="col-lg-2 col-sm-2 data-div">
          <Typography fontWeight="500" mr={1} variant="body1">
            Marca:
          </Typography>
          <Typography fontWeight="700" mr={1} variant="body1">
            {material?.brand}
          </Typography>
        </div>

        <div className="col-lg-2 col-sm-2 data-div">
          <Typography fontWeight="500" mr={1} variant="body1">
            Tipo:
          </Typography>
          <Typography fontWeight="700" mr={1} variant="body1">
            {material?.type}
          </Typography>
        </div>

        <div className="col-lg-2 col-sm-2 data-div">
          <Typography fontWeight="500" mr={1} variant="body1">
            Composición:
          </Typography>
          <Typography fontWeight="700" variant="body1">
            {material?.component}
          </Typography>
        </div>

        <div className="col-lg-2 col-sm-2 data-div">
          <Typography fontWeight="500" mr={1} variant="body1">
            Precio de presentación:
          </Typography>
          <Typography fontWeight="700" variant="body1">
            {`$ ${material?.presentationPrice}`}
          </Typography>
        </div>

        <div className="col-lg-2 col-sm-2 data-div">
          <Typography fontWeight="500" mr={1} variant="body1">
            Cantidad de presentación:
          </Typography>
          <Typography fontWeight="700" variant="body1">
            {material?.presentationQuantity}
          </Typography>
        </div>

        <div className="col-lg-2 col-sm-2 data-div">
          <Typography fontWeight="500" mr={1} variant="body1">
            Precio unitario:
          </Typography>
          <Typography fontWeight="700" variant="body1">
            {`${unitPricePrefix} ${unitPrice}`}
          </Typography>
        </div>

        <div className="col-lg-2 col-sm-2 data-div">
          <Typography fontWeight="500" mr={1} variant="body1">
            Fecha del precio:
          </Typography>
          <Typography fontWeight="700" variant="body1">
            {material?.priceDate}
          </Typography>
        </div>

        <div className="col-lg-2 col-sm-2 data-div">
          <Typography fontWeight="500" mr={1} variant="body1">
            Vida útil:
          </Typography>
          <Typography fontWeight="700" variant="body1">
            {`${material?.potLife} horas`}
          </Typography>
        </div>

        <div className="col-lg-2 col-sm-2 data-div">
          <Typography fontWeight="500" mr={1} variant="body1">
            Temp min aplicable:
          </Typography>
          <Typography fontWeight="700" variant="body1">
            {`${material?.minApplicableTemp} °C`}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default MaterialData;
