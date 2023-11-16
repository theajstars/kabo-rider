import React, { useState, useEffect, useContext } from "react";

import { useNavigate, Link } from "react-router-dom";

import {
  Alert,
  AlertTitle,
  Button,
  Modal,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  Chip,
  TableBody,
} from "@mui/material";

import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

import { useToasts } from "react-toast-notifications";
import Cookies from "js-cookie";

import "./styles.scss";
import MegaLoader from "../../Misc/MegaLoader";
import { AppContext } from "../DashboardContainer";
import { PerformRequest, usePerformRequest } from "../../Lib/PerformRequest";
import { Endpoints } from "../../Lib/Endpoints";
import {
  DefaultResponse,
  GetOrdersResponse,
  PaginatedResponse,
} from "../../Lib/Responses";
import {
  Notification as RiderNotification,
  NotificationResponse,
  Order,
  Product,
  RiderStats,
} from "../../Lib/Types";
import ProgressCircle from "../../Misc/ProgressCircle";

export default function MyOrders() {
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
  const [isOrderLoading, setOrderLoading] = useState<boolean>(false);
  const [isOrderAccepting, setOrderAccepting] = useState<boolean>(false);

  const { data: orders, isLoading: isOrdersLoading } = usePerformRequest<
    Order[],
    PaginatedResponse<Order[]>
  >({
    method: "POST",
    url: Endpoints.GetOrders,
    body: {
      token: Cookies.get("token"),
      account: "rider",
      order_status: "Delivery",
    },
  });

  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isOrderModalVisible, setOrderModalVisible] = useState<boolean>(false);

  const getOrderDetails = async (referenceCode: string) => {
    removeAllToasts();
    setOrderLoading(true);
    const r: GetOrdersResponse = await PerformRequest({
      method: "POST",
      route: Endpoints.GetOrders,
      data: {
        token: Cookies.get("token"),
        reference_code: referenceCode,
        account: "rider",
      },
    }).catch(() => {
      setOrderLoading(false);
      addToast("An error occurred!", { appearance: "error" });
    });
    setOrderLoading(false);
    console.log(r.data);
    if (r && r.data && r.data.status === "success") {
      setCurrentOrder(r.data.data[0]);
    }
  };

  const containerStyle = {
    width: "400px",
    height: "400px",
  };

  const center = {
    lat: -3.745,
    lng: -38.523,
  };
  const { isLoaded: isMapLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBP36yIMHK0Fk1EFDoRNt_nLqadIm5wlMc",
  });

  const [map, setMap] = React.useState<any>(null);

  const onMapUnmount = React.useCallback(function callback(map: any) {
    setMap(null);
  }, []);
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

          {isOrdersLoading ? (
            <div className="flex-row width-100 justify-center align-center">
              <ProgressCircle />
            </div>
          ) : (
            <>
              {orders?.data.length === 0 ? (
                <Alert severity="info" sx={{ width: "100%", padding: "10px" }}>
                  <AlertTitle>There are no notifications</AlertTitle>
                </Alert>
              ) : (
                <>
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
                        {orders?.data.map((order) => {
                          if (order.reference_code.length > 0) {
                            return (
                              <TableRow key={order.reference_code}>
                                <TableCell>{order.reference_code}</TableCell>
                                <TableCell>
                                  <div className="flex-col">
                                    {order.shipping.map((shipping) => {
                                      return <span>{shipping.address}</span>;
                                    })}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Button
                                    sx={{
                                      fontSize: "13px",
                                    }}
                                    onClick={() => {
                                      getOrderDetails(order.reference_code);
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
                          }
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Modal
                    open={isOrderModalVisible}
                    onClose={() => {
                      setOrderModalVisible(false);
                    }}
                  >
                    <div className="order-modal flex-col">
                      <div className="flex-row width-100 align-center justify-center">
                        <span className="px-14 fw-600">Order Details</span>
                      </div>
                      {isOrderLoading ? (
                        <span className="flex-row align-center justify-center width-100">
                          Loading&nbsp;
                          <ProgressCircle />
                        </span>
                      ) : (
                        <>
                          {currentOrder && (
                            <>
                              {isMapLoaded && (
                                <div className="flex-row width-100 align-center justify-center">
                                  <GoogleMap
                                    mapContainerStyle={containerStyle}
                                    center={{
                                      lat: currentOrder.shipping[0].latitude,
                                      lng: currentOrder.shipping[0].longitude,
                                    }}
                                    zoom={30}
                                    // onLoad={onMapLoad}
                                    onUnmount={onMapUnmount}
                                  >
                                    <Marker
                                      //onLoad={onLoad}
                                      position={{
                                        lat: currentOrder.shipping[0].latitude,
                                        lng: currentOrder.shipping[0].longitude,
                                      }}
                                    >
                                      <InfoWindow
                                        options={{ maxWidth: 100 }}
                                        position={{
                                          lat: currentOrder.shipping[0]
                                            .latitude,
                                          lng: currentOrder.shipping[0]
                                            .longitude,
                                        }}
                                      >
                                        <span>Delivery</span>
                                      </InfoWindow>
                                    </Marker>
                                  </GoogleMap>
                                </div>
                              )}
                              <div className="flex-row modal-row">
                                <span className="px-15 fw-600">Total Gain</span>
                                <Chip label="Chip Filled" color="success" />
                              </div>
                              <div className="flex-row modal-row">
                                <span className="px-15 fw-600">
                                  Reference Code
                                </span>

                                <span className="px-15 fw-400">
                                  {currentOrder.reference_code}
                                </span>
                              </div>
                              <div className="flex-row modal-row">
                                <span className="px-15 fw-600">Users</span>
                                {currentOrder.customer.map((c) => {
                                  return (
                                    <span>
                                      <span className="px-15 fw-400">
                                        {c.othernames}
                                      </span>
                                      &nbsp;
                                      <span className="px-15 fw-400">
                                        {c.lastname}
                                      </span>
                                      &nbsp; - &nbsp;
                                      <span className="px-15 fw-400">
                                        {c.phone}
                                      </span>
                                    </span>
                                  );
                                })}
                              </div>
                              <div className="flex-row modal-row">
                                <span className="px-15 fw-600">Stores</span>
                                {currentOrder.store.map((c) => {
                                  return (
                                    <span>
                                      <span className="px-15 fw-400">
                                        {c.name}
                                      </span>
                                    </span>
                                  );
                                })}
                              </div>
                              <div className="flex-row modal-row">
                                <span className="px-15 fw-600">Products</span>
                                <table border={1}>
                                  <thead>
                                    <tr>
                                      <th>Name</th>
                                      <th>Quantity</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {currentOrder.product.map((p) => {
                                      return (
                                        <tr>
                                          <td>{p.name}</td>
                                          <td>{p.quantity}</td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                              <div className="flex-row modal-row">
                                <span className="px-15 fw-600">
                                  Shipping details
                                </span>
                                {currentOrder.shipping.map((c) => {
                                  return (
                                    <span className="flex-col">
                                      <span className="px-15 fw-400">
                                        {c.address}
                                      </span>
                                      <span className="px-15 fw-400">
                                        {c.details}
                                      </span>
                                    </span>
                                  );
                                })}
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </Modal>
                </>
              )}
            </>
          )}
          <br />
        </>
      ) : (
        <MegaLoader />
      )}
    </div>
  );
}
