import React, { useState } from "react";

import { Link } from "react-router-dom";

import { TextField, CardContent, Button, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useToasts } from "react-toast-notifications";

import Logo from "../../Assets/IMG/Logo.png";

import "./styles.scss";
import { DefaultResponse } from "../../Lib/Responses";
import { validateEmail } from "../../Lib/Methods";
import { PerformRequest } from "../../Lib/PerformRequest";
import { Endpoints } from "../../Lib/Endpoints";
import ProgressCircle from "../../Misc/ProgressCircle";

interface UserFormValuesProps {
  email: string;
  password: string;
  phone: string;
  username: string;
  referralCode?: string;
  showPassword: boolean;
}

export default function Register() {
  const navigate = useNavigate();
  const { addToast, removeAllToasts } = useToasts();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [userFormValues, setUserFormValues] = useState<UserFormValuesProps>({
    email: "",
    password: "",
    phone: "",
    username: "",
    showPassword: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    removeAllToasts();
    e.preventDefault();
    console.log(userFormValues);
    const { username, email, phone, password, referralCode } = userFormValues;
    const isEmailValid = validateEmail(email);

    if (
      username.length === 0 ||
      password.length === 0 ||
      phone.length !== 11 ||
      !isEmailValid
    ) {
      addToast("Please fill the form correctly!", { appearance: "error" });
    } else {
      setLoading(true);
      const r: DefaultResponse = await PerformRequest({
        method: "POST",
        route: Endpoints.RegisterUser,
        data: {
          username,
          email,
          phone,
          passcode: password,
          referral_code: referralCode,
        },
      }).catch(() => {
        setLoading(false);
      });
      console.log(r);
      setLoading(false);
      if (r.data && r.data.status) {
        const { status } = r.data;
        if (status === "success") {
          addToast("Account Created!", { appearance: "success" });
          navigate("/login");
        } else {
          addToast(r.data.message, { appearance: "error" });
        }
      }
    }
  };

  return (
    <div className="register-container flex-row width-100">
      <div className="content">
        <CardContent>
          <div className="flex-row align-center justify-center width-100">
            <img src={Logo} alt="" className="logo" />
          </div>

          <form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <span className="text-dark px-19 fw-600">User Information</span>
            <br />
            <br />
            <div className="flex-row align-center justify-between width-100">
              <TextField
                fullWidth
                size="small"
                label="Username"
                sx={{ marginBottom: 4 }}
                value={userFormValues.username}
                onChange={(e) =>
                  setUserFormValues({
                    ...userFormValues,
                    username: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex-row align-center justify-between width-100">
              <TextField
                fullWidth
                size="small"
                label="Email"
                sx={{ marginBottom: 4 }}
                value={userFormValues.email}
                onChange={(e) =>
                  setUserFormValues({
                    ...userFormValues,
                    email: e.target.value,
                  })
                }
              />
              &nbsp; &nbsp; &nbsp; &nbsp;
              <TextField
                fullWidth
                size="small"
                label="Phone"
                sx={{ marginBottom: 4 }}
                value={userFormValues.phone}
                onChange={(e) =>
                  setUserFormValues({
                    ...userFormValues,
                    phone: e.target.value,
                  })
                }
              />
            </div>
            <TextField
              autoFocus
              fullWidth
              id="password"
              label="password"
              size="small"
              type={userFormValues.showPassword ? "text" : "password"}
              value={userFormValues.password}
              onChange={(e) =>
                setUserFormValues({
                  ...userFormValues,
                  password: e.target.value,
                })
              }
            />
            <small
              className="px-12 pointer text-dark"
              onClick={() => {
                setUserFormValues({
                  ...userFormValues,
                  showPassword: !userFormValues.showPassword,
                });
              }}
            >
              {userFormValues.showPassword ? "Hide" : "Show"} Password &nbsp;
              {userFormValues.showPassword ? (
                <i className="far fa-eye-slash" />
              ) : (
                <i className="far fa-eye" />
              )}
            </small>
            <TextField
              fullWidth
              size="small"
              label="Referral Code"
              sx={{ mt: 2, mb: 3 }}
              value={userFormValues.referralCode}
              onChange={(e) =>
                setUserFormValues({
                  ...userFormValues,
                  referralCode: e.target.value,
                })
              }
            />
            <br />

            <Button
              fullWidth
              size="large"
              sx={{
                height: "35px",
                fontSize: "15px",
                textTransform: "capitalize",
              }}
              variant="contained"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? <ProgressCircle /> : "Create Account"}
            </Button>
          </form>
          <br />
          <div className="flex-row align-center justify-between">
            <span className="px-14">Already have an account?</span>
            <Link className="text-blue-default" to="/login">
              Login
            </Link>
          </div>
        </CardContent>
      </div>
    </div>
  );
}
