const Endpoints = {
  CreateStore: "/store/create",
  GetStoreList: "/store/list",
  GetUserStore: "/store/details",

  CreateNewProduct: "/store/add-product",

  GetSubCategory: "/store/sub-category",

  GetOrders: "/order/details",

  AddTeamMember: "/store/add-teams",
  GetTeam: "/store/teams",

  UploadFile: "/misc/file-upload",

  RegisterUser: "/account/register",
  RegisterAsRider: "/rider/register",
  LoginUser: "/account/login",
  RecoverAccount: "/account/recover-account",
  GetUserDetails: "/account/details",
  UpdateAccount: "/account/update-profile",
  GetRiderStats: "/rider/details",

  GetProducts: "/store/products",
  SearchStores: "/store/search",
  GetProductCategory: "/store/category",

  GetUserCart: "/order/cart",
  AddProductToCart: "/order/add",
  RemoveProductFromCart: "/order/remove",
  UpdateCart: "/order/update",
  AddShippingInformation: "/order/shipping",
  CheckoutCart: "/order/checkout",
  GetWalletDetails: "/wallet/details",
  ProcessWalletTransfer: "/wallet/transfer",

  GetSavedItems: "/favourite/list",
  AddToSaved: "/favourite/add",
  RemoveFromSaved: "/favourite/delete",

  GetBanks: "/wallet/banks",
  UpdateBankAccount: "/account/update-bank-details",

  TrackVerification: "/verification/track",
  RequestOTP: "/account/request-otp",
  ValidateOTP: "/account/validate-otp",
};
export { Endpoints };
