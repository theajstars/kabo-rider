import React, { useState, useEffect, useContext } from "react";

import { useNavigate, Link } from "react-router-dom";

import {
  Alert,
  AlertTitle,
  Button,
  Grid,
  Container,
  FormControl,
  TextField,
} from "@mui/material";
import { useToasts } from "react-toast-notifications";
import Cookies from "js-cookie";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "./styles.scss";
import MegaLoader from "../../Misc/MegaLoader";
import { AppContext } from "../DashboardContainer";
import { PerformRequest, usePerformRequest } from "../../Lib/PerformRequest";
import { Endpoints } from "../../Lib/Endpoints";
import {
  DefaultResponse,
  GetProductsResponse,
  NonPaginatedResponse,
} from "../../Lib/Responses";
import { Kyc, Product, RiderStats } from "../../Lib/Types";
import {
  getFullDate,
  getHalfDate,
  validatePhoneNumber,
} from "../../Lib/Methods";

interface BvnFormProps {
  bvn: string;
  phone: string;
  otp: string;
  dob: Date;
}
export default function Verification() {
  const navigate = useNavigate();
  const { addToast, removeAllToasts } = useToasts();
  const riderContext = useContext(AppContext);

  const [isLoading, setLoading] = useState<boolean>(false);

  const [isOTPSent, setOTPSent] = useState<boolean>(false);
  const [isOTPLoading, setOTPLoading] = useState<boolean>(false);

  const kyc = riderContext?.customerKyc
    ? riderContext.customerKyc.map((k) => k.code)
    : [];

  const [bvnVerificationForm, setBvnVerificationForm] = useState<BvnFormProps>({
    bvn: "",
    phone: "",
    otp: "",
    dob: new Date(),
  });

  const RequestOTP = async () => {
    removeAllToasts();
    const { phone } = bvnVerificationForm;
    const isPhoneValid = validatePhoneNumber(phone);
    if (!isPhoneValid) {
      addToast("Please enter a valid phone number", { appearance: "warning" });
    } else {
      setOTPLoading(true);
      const r: DefaultResponse = await PerformRequest({
        route: Endpoints.RequestOTP,
        method: "POST",
        data: { phone },
      }).catch(() => {
        setOTPLoading(false);
      });
      addToast(r.data.message, {
        appearance: r.data.status === "success" ? "success" : "error",
      });
      setOTPLoading(false);
    }
  };
  const SubmitBvnForm = async () => {
    removeAllToasts();
    const { phone, otp, bvn, dob } = bvnVerificationForm;
    const isPhoneValid = validatePhoneNumber(phone);

    if (bvn.length !== 11 || !isPhoneValid || otp.length < 4) {
      addToast("Please complete the form!", { appearance: "warning" });
    } else {
      const r: DefaultResponse = await PerformRequest({
        route: Endpoints.DoVerification,
        method: "POST",
        data: {
          token: Cookies.get("token"),
          kyc_id: "1",
          phone_number: phone,
          bvn,
          dob,
        },
      });
    }
  };

  return (
    <>
      {riderContext?.rider ? (
        <Container maxWidth="lg" className="verification-container">
          <br />
          <Alert severity="warning">
            <AlertTitle>Incomplete Profile</AlertTitle>
            You must complete your KYC details first.
          </Alert>
          <br />
          {kyc.includes("bvn") && (
            <div className="bvn-form flex-col width-100">
              <FormControl variant="outlined">
                <TextField
                  label="BVN"
                  placeholder="Enter BVN"
                  name="bvn"
                  value={bvnVerificationForm.bvn}
                  onChange={(e) => {
                    setBvnVerificationForm({
                      ...bvnVerificationForm,
                      bvn: e.target.value,
                    });
                  }}
                />
              </FormControl>
              <br />
              <FormControl variant="outlined">
                <TextField
                  label="Phone Number"
                  placeholder="Enter Phone Number connected with your BVN"
                  name="bvn-phone"
                  value={bvnVerificationForm.phone}
                  onChange={(e) => {
                    setBvnVerificationForm({
                      ...bvnVerificationForm,
                      phone: e.target.value,
                    });
                  }}
                />
              </FormControl>
              <br />

              <br />
              {/* <FormControl variant="outlined">
                <TextField
                  label="OTP"
                  placeholder="Enter OTP sent to your phone"
                  disabled={isOTPSent}
                  name="otp"
                  value={bvnVerificationForm.otp}
                  onChange={(e) => {
                    setBvnVerificationForm({
                      ...bvnVerificationForm,
                      otp: e.target.value,
                    });
                  }}
                />
              </FormControl> */}
              <div className="flex-row align-center">
                {/* <Button
                  disabled={isOTPLoading}
                  onClick={RequestOTP}
                  variant="outlined"
                >
                  Request OTP
                </Button>
                &nbsp; &nbsp; &nbsp; */}
                <Button
                  // disabled={isOTPLoading || !isOTPSent}
                  onClick={SubmitBvnForm}
                  variant="contained"
                >
                  Verify BVN
                </Button>
              </div>
            </div>
          )}
        </Container>
      ) : (
        <MegaLoader />
      )}
    </>
  );
}
