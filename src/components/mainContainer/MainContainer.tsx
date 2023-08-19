import { Button } from "@mui/material";
import "bootstrap-css-only";
import React, { ReactNode } from "react";
import "./MainContainer.css";
import PageWrapper from "../pageWrapper/PageWrapper";

type MainContainerProps = {
  /** Texto renderizado como título de card*/
  cardTitle?: string;
  /** Elemento renderizado dentro de la card*/
  children: ReactNode;
  /** Si es true, se mostrarán botones submit y cancel */
  hasFooterButons?: boolean;
  /** Función que dispara evento botón cancelar */
  onCancel?: () => void;
  /** Función que dispara evento botón aceptar */
  onAccept?: () => void;
};

export const MainContainer: React.FC<MainContainerProps> = ({
  children,
  cardTitle,
  hasFooterButons,
  onCancel,
  onAccept,
}) => {
  return (
    <>
      <PageWrapper />
      <div className="card">
        <h1 className="card-title">{cardTitle}</h1>
        <div className="card-body">{children}</div>
        {hasFooterButons && (
          <div className="card-footer text-body-secondary align-right">
            <Button onClick={onCancel} variant="text">
              Cancelar
            </Button>
            <Button onClick={onAccept} variant="contained">
              Aceptar
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
