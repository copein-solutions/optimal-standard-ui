import { useState, useEffect } from "react";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

import "./login.css";

import Button from "@mui/material/Button";
import CustomTextField from "../../components/TextField";
import Toast from "../../components/toast/toast";
import { useForm } from "react-hook-form";
import { LoginInputs } from "../../interfaces/form/FormInterfaces";
import CustomPasswordField from "../../components/passwordField";
import { Typography } from "@mui/material";

// Services
import { login }  from "../../services/ApiService";

const Login = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginInputs>();

  const [showToast, setShowToast] = useState(false);
  const dispatch = useDispatch();
  const navigator = useNavigate();

  const handleOpenToast = () => {
    setShowToast(true);
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  const onSubmit = async (data: LoginInputs) => {
    localStorage.clear();
    let response = await login(data);
    
    if(response.data.token) {
      localStorage.setItem('credentials', JSON.stringify(response.data.token));
      dispatch({ type: "LOGIN", payload: true });
      navigator("/material/list");
    }
    setShowToast(true);
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
              name="username"
              control={control}
              rules={{ required: "Nombre de usuario requerido." }}
              label="Nombre de usuario"
              variant="outlined"
              fullWidth
              error={errors.username}
              helperText={errors.username?.message}
            />
          </div>
          <div className="col-lg-12 col-sm-6 mt-4">
            <CustomPasswordField
              name="password"
              control={control}
              rules={{ required: "Contraseña requerida." }}
              label="Contraseña"
              variant="outlined"
              fullWidth
              error={errors.password}
              helperText={errors.password?.message}
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
