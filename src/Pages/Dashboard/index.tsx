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

export default function Dashboard() {
  const navigate = useNavigate();
  const { addToast, removeAllToasts } = useToasts();
  const riderContext = useContext(AppContext);

  const [isLoading, setLoading] = useState<boolean>(false);
  const { data: stats, reloadData: getRiderStats } = usePerformRequest<
    RiderStats,
    NonPaginatedResponse<RiderStats>
  >({
    method: "POST",
    url: Endpoints.GetRiderStats,
    body: { token: Cookies.get("token") },
  });
  const orders = stats?.data ? stats.data.orders ?? [] : [];
  const orderStats = Object.entries(orders);

  return (
    <div
      className="dashboard-container flex-col width-100"
      style={{
        opacity: isLoading ? 0.5 : 1,
        cursor: isLoading ? "not-allowed" : "",
      }}
    >
      {riderContext?.rider ? (
        <>
          <div className="flex-col width-100 align-center justify-center dashboard">
            <Container maxWidth="xl" className="stats-row">
              <Grid
                container
                spacing={5}
                alignItems="center"
                justifyContent="center"
              >
                {orderStats.map((stat) => {
                  return (
                    <Grid item>
                      <div className="flex-col order">
                        <span className="fw-500 px-35">{stat[1]}</span>
                        <span className="px-12 capitalize text-dark-secondary">
                          {stat[0].replaceAll("_", " ")}
                        </span>
                      </div>
                    </Grid>
                  );
                })}
              </Grid>
            </Container>
          </div>
          <br />

          <br />
        </>
      ) : (
        <MegaLoader />
      )}
    </div>
  );
}
