import React, { useState, useEffect, useContext, useRef } from "react";

import { useNavigate, Link } from "react-router-dom";

import {
  Alert,
  AlertTitle,
  Button,
  Container,
  FormControl,
  TextField,
} from "@mui/material";
import { useToasts } from "react-toast-notifications";
import Cookies from "js-cookie";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import MegaLoader from "../../Misc/MegaLoader";
import { AppContext } from "../DashboardContainer";
import {
  PerformRequest,
  UploadFile,
  usePerformRequest,
} from "../../Lib/PerformRequest";
import { Endpoints } from "../../Lib/Endpoints";
import { DefaultResponse, UploadFileResponse } from "../../Lib/Responses";
import { Kyc, Product, RiderStats } from "../../Lib/Types";
import { getDateNum, validatePhoneNumber } from "../../Lib/Methods";
import ProgressCircle from "../../Misc/ProgressCircle";

import DefaultUserImage from "../../Assets/IMG/DefaultUserImage.png";

import "./styles.scss";

interface BvnFormProps {
  bvn: string;
  phone: string;
  otp: string;
  dob: Dayjs | null;
}
interface PhoneFormProps {
  phone: string;
  otp: string;
}
export default function Verification() {
  const navigate = useNavigate();
  const selfieUploadRef = useRef<HTMLInputElement>(null);
  const { addToast, removeAllToasts } = useToasts();
  const riderContext = useContext(AppContext);

  const [isLoading, setLoading] = useState<boolean>(false);

  const [isBVNLoading, setBVNLoading] = useState<boolean>(false);

  const [isOTPSent, setOTPSent] = useState<boolean>(false);
  const [isOTPLoading, setOTPLoading] = useState<boolean>(false);
  const [isPhoneLoading, setPhoneLoading] = useState<boolean>(false);

  const [selfieImage, setSelfieImage] = useState<File | null>(null);
  const [isImageUploading, setImageUploading] = useState<boolean>(false);

  const kyc = [
    ...(riderContext?.customerKyc
      ? riderContext.customerKyc.map((k) =>
          k.status !== "Successful" ? k.code : null
        )
      : []),
    ...(riderContext?.riderKyc
      ? riderContext.riderKyc.map((k) =>
          k.status !== "Successful" ? k.code : null
        )
      : []),
  ];

  console.log(kyc);

  const [bvnVerificationForm, setBvnVerificationForm] = useState<BvnFormProps>({
    bvn: "",
    phone: "",
    otp: "",
    dob: dayjs("2010-04-10"),
  });
  const [phoneVerificationForm, setPhoneVerificationForm] =
    useState<PhoneFormProps>({
      phone: "",
      otp: "",
    });

  const RequestOTP = async () => {
    removeAllToasts();
    const { phone } = phoneVerificationForm;
    const isPhoneValid = validatePhoneNumber(phone);
    if (!isPhoneValid) {
      addToast("Please enter a valid phone number", { appearance: "warning" });
    } else {
      setOTPLoading(true);
      const r: DefaultResponse = await PerformRequest({
        route: Endpoints.DoVerification,
        method: "POST",
        data: {
          phone,
          token: Cookies.get("token"),
          kyc_id: "6",
          send_otp: "Yes",
        },
      }).catch(() => {
        setOTPLoading(false);
      });
      setOTPLoading(false);
      if (r.data.status === "success") {
        setOTPSent(true);
      }
      addToast(r.data.message, {
        appearance: r.data.status === "success" ? "success" : "error",
      });
    }
  };
  const SubmitBvnForm = async () => {
    removeAllToasts();
    const { phone, otp, bvn, dob } = bvnVerificationForm;
    const isPhoneValid = validatePhoneNumber(phone);
    console.log(dob?.toDate());
    console.log(getDateNum(dob?.toDate().toDateString()));
    if (bvn.length !== 11 || !isPhoneValid) {
      addToast("Please complete the form!", { appearance: "warning" });
    } else {
      setBVNLoading(true);
      const r: DefaultResponse = await PerformRequest({
        route: Endpoints.DoVerification,
        method: "POST",
        data: {
          token: Cookies.get("token"),
          kyc_id: "1",
          phone_number: phone,
          bvn,
          dob: getDateNum(dob?.toDate().toDateString()),
        },
      }).catch(() => {
        setBVNLoading(false);
      });
      setBVNLoading(false);
      if (r && r.data && r.data.status === "success") {
        addToast("BVN Uploaded Successfully!", { appearance: "success" });
      } else {
        addToast(r.data.message ?? "", { appearance: "error" });
      }
    }
  };
  const SubmitPhoneForm = async () => {
    removeAllToasts();
    const { phone, otp } = phoneVerificationForm;
    const isPhoneValid = validatePhoneNumber(phone);

    if (!isPhoneValid || otp.length === 0) {
      addToast("Please complete the form!", { appearance: "warning" });
    } else {
      setPhoneLoading(true);
      const r: DefaultResponse = await PerformRequest({
        route: Endpoints.DoVerification,
        method: "POST",
        data: {
          token: Cookies.get("token"),
          kyc_id: "6",
          otp,
          send_otp: "No",
        },
      }).catch(() => {
        setPhoneLoading(false);
      });
      setPhoneLoading(false);
      if (r) {
        if (r.data && r.data.status === "success") {
          addToast("Phone verified Successfully!", { appearance: "success" });
        } else {
          addToast(r.data.message ?? "", { appearance: "error" });
        }
      }
    }
  };

  const getCurrentImage = () => {
    if (selfieImage) {
      return URL.createObjectURL(selfieImage);
    } else {
      return DefaultUserImage;
    }
  };

  const UploadImage = async () => {
    if (selfieImage) {
      setImageUploading(true);
      const r: UploadFileResponse = await UploadFile(selfieImage).catch(() => {
        setImageUploading(false);
      });
      if (r && r.data && r.data.status === "success") {
        // Send request to Verification Endpoint
        const r2: DefaultResponse = await PerformRequest({
          method: "POST",
          route: Endpoints.DoVerification,
          data: {
            token: Cookies.get("token"),
            kyc_id: "5",
            photo_url: r.data.file_url,
          },
        }).catch(() => {
          setImageUploading(false);
        });
        if (r2 && r2.data && r2.data.status === "success") {
          addToast("Image Uploaded successfully!", { appearance: "success" });
        } else {
          addToast(r.data.message, { appearance: "error" });
        }
      } else {
        setImageUploading(false);
      }
    } else {
      addToast("You must select an image!", { appearance: "error" });
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
            <div className="verify-form flex-col width-100">
              <span className="px-16 fw-500 text-dark-secondary">
                BVN Verification
              </span>
              <br />
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
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    label="Date of Birth"
                    value={bvnVerificationForm.dob}
                    onChange={(date) =>
                      setBvnVerificationForm({
                        ...bvnVerificationForm,
                        dob: date,
                      })
                    }
                  />
                </DemoContainer>
              </LocalizationProvider>
              <br />

              <div className="flex-row align-center">
                <Button
                  className="btn"
                  disabled={isBVNLoading}
                  onClick={SubmitBvnForm}
                  variant="contained"
                >
                  {isBVNLoading ? <ProgressCircle /> : "Verify BVN"}
                </Button>
              </div>
            </div>
          )}
          {kyc.includes("phone_number") && (
            <div className="verify-form flex-col width-100">
              <span className="px-16 fw-500 text-dark-secondary">
                Phone Verification
              </span>
              <br />
              <FormControl variant="outlined">
                <TextField
                  label="Phone Number"
                  placeholder="Enter Phone Number"
                  name="phone"
                  value={phoneVerificationForm.phone}
                  onChange={(e) => {
                    setPhoneVerificationForm({
                      ...phoneVerificationForm,
                      phone: e.target.value,
                    });
                  }}
                />
              </FormControl>
              <br />
              <FormControl variant="outlined">
                <TextField
                  label="OTP"
                  placeholder="Enter OTP sent to your phone"
                  disabled={!isOTPSent}
                  name="otp"
                  value={phoneVerificationForm.otp}
                  onChange={(e) => {
                    setPhoneVerificationForm({
                      ...phoneVerificationForm,
                      otp: e.target.value,
                    });
                  }}
                />
              </FormControl>
              <br />
              <div className="flex-row align-center">
                <Button
                  className="btn"
                  disabled={isOTPLoading}
                  onClick={RequestOTP}
                  variant="outlined"
                >
                  {isOTPLoading ? <ProgressCircle /> : "Request OTP"}
                </Button>
                &nbsp; &nbsp; &nbsp;
                <Button
                  className="btn"
                  disabled={isOTPLoading || !isOTPSent || isPhoneLoading}
                  onClick={SubmitPhoneForm}
                  variant="contained"
                >
                  {isPhoneLoading ? <ProgressCircle /> : "Verify Phone"}
                </Button>
              </div>
            </div>
          )}
          {kyc.includes("face_comparison") && (
            <div className="verify-form flex-col width-100">
              <input
                type="file"
                ref={selfieUploadRef}
                accept=".png, .jpeg, .jpg"
                className="display-none"
                onChange={(e) => {
                  const files = e.target.files ?? [];
                  if (files[0]) {
                    setSelfieImage(files[0]);
                  }
                }}
              />
              <div className="flex-row align-center">
                <img src={getCurrentImage()} alt="" className="selfie-image" />
                &nbsp; &nbsp;
                <Button
                  color="primary"
                  variant="contained"
                  className="btn"
                  onClick={() => {
                    selfieUploadRef.current?.click();
                  }}
                >
                  {selfieImage ? "Replace Image" : "Choose Image"}
                </Button>
                &nbsp; &nbsp;
                <Button
                  color="primary"
                  variant="contained"
                  className="btn"
                  disabled={!selfieImage || isImageUploading}
                  onClick={UploadImage}
                >
                  {isImageUploading ? <ProgressCircle /> : "Upload Image"}
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
