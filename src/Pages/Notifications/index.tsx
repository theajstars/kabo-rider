import React, { useState, useEffect, useContext } from "react";

import { useNavigate, Link } from "react-router-dom";

import {
  Alert,
  AlertTitle,
  Button,
  Grid,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
} from "@mui/material";
import { useToasts } from "react-toast-notifications";
import Cookies from "js-cookie";

import "./styles.scss";
import MegaLoader from "../../Misc/MegaLoader";
import { AppContext } from "../DashboardContainer";
import { PerformRequest, usePerformRequest } from "../../Lib/PerformRequest";
import { Endpoints } from "../../Lib/Endpoints";
import { GetProductsResponse, NonPaginatedResponse } from "../../Lib/Responses";
import {
  Notification as RiderNotification,
  NotificationResponse,
  Product,
  RiderStats,
} from "../../Lib/Types";

export default function Notifications() {
  const navigate = useNavigate();
  const { addToast, removeAllToasts } = useToasts();
  const riderContext = useContext(AppContext);
  useEffect(() => {
    const kyc = [
      ...(riderContext?.customerKyc
        ? riderContext.customerKyc.filter((k) => k.status !== "Successful")
        : []),
      ...(riderContext?.riderKyc
        ? riderContext.riderKyc.filter((k) => k.status !== "Successful")
        : []),
    ];
    console.log("Da KYC", kyc);
    if (kyc.length !== 0) {
      navigate("/dashboard/verification");
    }
  }, [riderContext]);

  const [isLoading, setLoading] = useState<boolean>(false);

  const { data: riderNotifications } = usePerformRequest<
    NotificationResponse,
    NonPaginatedResponse<NotificationResponse>
  >({
    method: "POST",
    url: Endpoints.GetNotifications,
    body: { token: Cookies.get("token") },
  });
  console.log(riderNotifications?.data.orders);

  const [currentOrder, setCurrentOrder] = useState<RiderNotification | null>();
  const [isOrderModalVisible, setOrderModalVisible] = useState<boolean>(false);
  return (
    <div
      className="notifications-container flex-col width-100"
      style={{
        opacity: isLoading ? 0.5 : 1,
        cursor: isLoading ? "not-allowed" : "",
      }}
    >
      {riderContext?.rider ? (
        <>
          <div className="flex-col width-100 align-center justify-center notifications">
            <span className="px-17 fw-500">Pending Orders</span>
          </div>
          <br />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Reference Code</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {riderNotifications?.data.orders.map((order) => {
                  return (
                    <TableRow key={order.reference_code}>
                      <TableCell>{order.reference_code}</TableCell>
                      <TableCell>{order.address}</TableCell>
                      <TableCell>
                        <Button
                          sx={{
                            fontSize: "13px",
                          }}
                          onClick={() => {
                            setCurrentOrder(order);
                            setOrderModalVisible(true);
                          }}
                          variant="contained"
                          color="primary"
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <br />
        </>
      ) : (
        <MegaLoader />
      )}
    </div>
  );
}
