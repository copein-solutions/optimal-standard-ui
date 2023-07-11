import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

import "./login.css";

import Button from "@mui/material/Button";
import CustomTextField from "../../components/TextField";
import Toast from "../../components/toast/toast";
import { useForm } from "react-hook-form";
import { loginInputs } from "../../interfaces/form/FormInterfaces";
import CustomPasswordField from "../../components/passwordField";
import { Typography } from "@mui/material";

const Login = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<loginInputs>();

  const [showToast, setShowToast] = useState(false);

  const handleOpenToast = () => {
    setShowToast(true);
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  const onSubmit = async (data: loginInputs) => {
    setShowToast(true);
    console.log(data);
  };

  return (
    <div>
      <div className="login-box">
        <Typography variant="h2" fontWeight="500" className="title">
          STDO App
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="col-lg-12 col-sm-6 mt-5">
            <CustomTextField
              name="loginName"
              control={control}
              rules={{ required: "Nombre requerido." }}
              label="Nombre"
              variant="outlined"
              fullWidth
              error={errors.loginName}
              helperText={errors.loginName?.message}
            />
          </div>
          <div className="col-lg-12 col-sm-6 mt-4">
            <CustomPasswordField
              name="loginPassword"
              control={control}
              rules={{ required: "Contraseña requerida." }}
              label="Contraseña"
              variant="outlined"
              fullWidth
              error={errors.loginPassword}
              helperText={errors.loginPassword?.message}
            />
          </div>
          <div className="col-lg-12 col-sm-6 mt-5">
            <Button
              onClick={handleSubmit(onSubmit)}
              type="submit"
              variant="contained"
              className="w-100"
            >
              Ingresar
            </Button>
          </div>
          <div className="col-lg-12 col-sm-6 mt-5 text-buttons">
            <Button
              // onClick={handleSubmit(onSubmit)}
              type="submit"
              variant="text"
            >
              No estás registrado?
            </Button>
            <Button
              // onClick={handleSubmit(onSubmit)}
              type="submit"
              variant="text"
            >
              Olvidaste tu contraseña?
            </Button>
          </div>
        </form>
      </div>
      <Toast
        type="error"
        message="Credenciales incorrectas"
        open={showToast}
        onClose={handleCloseToast}
      />
    </div>
  );
};

export default Login;
