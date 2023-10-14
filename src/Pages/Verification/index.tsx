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
import { Product, RiderStats } from "../../Lib/Types";

export default function Verification() {
  const navigate = useNavigate();
  const { addToast, removeAllToasts } = useToasts();
  const riderContext = useContext(AppContext);

  const [isLoading, setLoading] = useState<boolean>(false);

  return (
    <div
      className="verification-container flex-col width-100"
      style={{
        opacity: isLoading ? 0.5 : 1,
        cursor: isLoading ? "not-allowed" : "",
      }}
    >
      {riderContext?.rider ? (
        <>
          <div className="flex-col width-100 align-center justify-center verification"></div>
          <br />

          <br />
        </>
      ) : (
        <MegaLoader />
      )}
    </div>
  );
}
