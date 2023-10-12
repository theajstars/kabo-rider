import React, { useState, useEffect, createContext } from "react";

import {
  useNavigate,
  Link,
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import { useToasts } from "react-toast-notifications";
import Cookies from "js-cookie";

import { Bank, Store, Rider, Wallet as WalletType } from "../../Lib/Types";

import "./styles.scss";
import { PerformRequest } from "../../Lib/PerformRequest";
import { Endpoints } from "../../Lib/Endpoints";
import {
  GetBanksResponse,
  GetStoreListResponse,
  GetWalletResponse,
  LoginResponse,
} from "../../Lib/Responses";
import MegaLoader from "../../Misc/MegaLoader";

import Dashboard from "../Dashboard";
import Navbar from "../Navbar";

import Profile from "../Profile";
import Wallet from "../Wallet";

interface FetchProductProps {
  page: number;
  limit: number;
  category_id?: string;
}

interface GetStoresProps {
  page: number;
  limit: number;
}
interface AppContextProps {
  rider: Rider | null;
  getRider: () => void;
  logout: () => void;
  banks: Bank[] | [];
  stores: Store[] | [];
  getStores?: ({ page, limit }: FetchProductProps) => void;
  storeCount: number;

  wallet: WalletType | null;
}
const AppContext = createContext<AppContextProps | null>(null);
export default function DashboardContainer() {
  const navigate = useNavigate();
  const { addToast, removeAllToasts } = useToasts();
  const [rider, setRider] = useState<Rider | null>(null);

  const [stores, setStores] = useState<Store[]>([]);
  const [storeCount, setStoreCount] = useState<number>(0);

  const [wallet, setWallet] = useState<WalletType | null>(null);

  const [banks, setBanks] = useState<Bank[]>([]);

  const getRider = async () => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/login");
    }
    const r: LoginResponse = await PerformRequest({
      route: Endpoints.GetUserDetails,
      method: "POST",
      data: { token: token },
    }).catch(() => {});
    console.log(r);
    if (r.data && r.data.data) {
      setRider(r.data.data);
    } else {
      navigate("/login");
    }
    const r2: GetWalletResponse = await PerformRequest({
      route: Endpoints.GetWalletDetails,
      method: "POST",
      data: {
        token,
        account: "customer",
      },
    });
    if (r2.data && r2.data.data) {
      setWallet(r2.data.data[0] ?? null);
    }
  };
  const getBanks = async () => {
    const token = Cookies.get("token");
    const r: GetBanksResponse = await PerformRequest({
      route: Endpoints.GetBanks,
      method: "POST",
      data: { token: token },
    });
    console.log(r);
    if (r.data && r.data.status === "success") {
      setBanks(r.data.data ?? []);
    }
  };
  const getStores = async ({ page, limit }: GetStoresProps) => {
    const token = Cookies.get("token");
    const r: GetStoreListResponse = await PerformRequest({
      route: Endpoints.GetStoreList,
      method: "POST",
      data: {
        token: token,
        page: page,
        limit: limit,
      },
    }).catch(() => {});
    if (r.data && r.data.data) {
      setStores(r.data.data);
      setStoreCount(r.data.counts);
    }
  };

  useEffect(() => {
    getRider();

    getBanks();

    getStores({ page: 1, limit: 10 });
  }, []);

  const logout = () => {
    Cookies.remove("token");
    navigate("/login");
  };
  return (
    <AppContext.Provider
      value={{
        rider: rider,
        getRider: getRider,
        logout: logout,

        stores: stores,
        getStores: getStores,
        wallet: wallet,
        storeCount: storeCount,

        banks: banks,
      }}
    >
      <Navbar />
      <Routes>
        <Route index path="/" element={<Dashboard />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/wallet" element={<Wallet />} />
      </Routes>
    </AppContext.Provider>
  );
}
export { AppContext };
