import React, { useState, useEffect, useContext } from "react";

import { useNavigate, Link } from "react-router-dom";

import { Alert, AlertTitle, Button, Grid, Container } from "@mui/material";
import { useToasts } from "react-toast-notifications";
import Cookies from "js-cookie";

import "./styles.scss";
import MegaLoader from "../../Misc/MegaLoader";
import { AppContext } from "../DashboardContainer";
import { PerformRequest, usePerformRequest } from "../../Lib/PerformRequest";
import { Endpoints } from "../../Lib/Endpoints";
import { GetProductsResponse, NonPaginatedResponse } from "../../Lib/Responses";
import { Kyc, Product, RiderStats } from "../../Lib/Types";

export default function Verification() {
  const navigate = useNavigate();
  const { addToast, removeAllToasts } = useToasts();
  const riderContext = useContext(AppContext);

  const [isLoading, setLoading] = useState<boolean>(false);

  const { data: customerKycData, isLoading: isLoadingCustomerKyc } =
    usePerformRequest<Kyc, NonPaginatedResponse<Kyc[]>>({
      method: "POST",
      url: Endpoints.TrackVerification,
      body: { token: Cookies.get("token"), account: "customer" },
    });

  return (
    <>
      {riderContext?.rider ? (
        <>
          <Container maxWidth="lg">
            <Alert severity="warning">
              <AlertTitle>Incomplete Profile</AlertTitle>
              You must complete your KYC details first.
            </Alert>
          </Container>

          <br />

          <br />
        </>
      ) : (
        <MegaLoader />
      )}
    </>
  );
}
