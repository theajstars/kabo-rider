import StoreIcon from "@mui/icons-material/Storefront";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CartIcon from "@mui/icons-material/LocalGroceryStore";
import OrdersIcon from "@mui/icons-material/ContentPaste";
import ProfileIcon from "@mui/icons-material/AccountCircle";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
const RouteList = [
  {
    label: "Notifications",
    route: "notifications",
    icon: NotificationsActiveIcon,
  },
  { label: "My Orders", route: "orders", icon: OrdersIcon },
  { label: "Wallet", route: "wallet", icon: WalletIcon },
  { label: "My Profile", route: "profile", icon: ProfileIcon },
];
export { RouteList };
