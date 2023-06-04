import "bootstrap-css-only";
import React, { ReactNode } from "react";
import "./MainContainer.css";

type MainContainerProps = {
    /** Texto renderizado como título de card*/
    cardTitle?: string;
    /** Elemento renderizado dentro de la card*/
    children: ReactNode;
};

export const MainContainer: React.FC<MainContainerProps> = ({ children, cardTitle }) => {
  return (
    <div className="card">
      <h1 className="card-title">{cardTitle}</h1>
      <div className="card-body">{children}</div>
    </div>
  );
};
