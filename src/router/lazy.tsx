/* eslint-disable @typescript-eslint/object-curly-spacing */
import { lazy } from 'react';
import { Loading } from '@/components';

const handleCatchChunkError = () => {
  window.location.reload();

  return { default: Loading };
};


// ADMIN
export const Home = lazy(() =>
  import('@/pages/Home').then(({ Home }) => ({ default: Home })).catch(handleCatchChunkError));

export const MyProfileHome = lazy(() =>
  import('@/pages/MyProfile').then(({ MyProfile }) => ({ default: MyProfile })).catch(handleCatchChunkError));

export const UserEdit = lazy(() =>
  import('@/pages/Home/UserEdit').then(({ UserEdit }) => ({ default: UserEdit })).catch(handleCatchChunkError));

export const AddUser = lazy(() =>
  import('@/pages/Home/AddUser').then(({ AddUser }) => ({ default: AddUser })).catch(handleCatchChunkError));

export const Login = lazy(() =>
  import('@/pages/Login').then(({ Login }) => ({ default: Login })).catch(handleCatchChunkError));

export const Companies = lazy(() =>
  import('@/pages/Companies').then(({ Companies }) => ({ default: Companies })).catch(handleCatchChunkError));

export const Roles = lazy(() =>
  import('@/pages/SuperAdmin').then(({ Roles }) => ({ default: Roles })).catch(handleCatchChunkError));

//PRODUCT MANAGER
export const Process = lazy(() =>
  import('@/pages/Process').then(({ Process }) => ({ default: Process })).catch(handleCatchChunkError));

export const Categories = lazy(() =>
  import('@/pages/Category').then(({ Categories }) => ({ default: Categories })).catch(handleCatchChunkError));

export const MyLogs = lazy(() =>
  import('@/pages/Tasks').then(({ MyLogs }) => ({ default: MyLogs })).catch(handleCatchChunkError));

export const Model = lazy(() =>
  import('@/pages/Model').then(({ Model }) => ({ default: Model })).catch(handleCatchChunkError));

export const WorkOn = lazy(() =>
  import('@/pages/Tasks/WorkOn').then(({ WorkOn }) => ({ default: WorkOn })).catch(handleCatchChunkError));

export const Base = lazy(() =>
  import('@/pages/Base').then(({ Base }) => ({ default: Base })).catch(handleCatchChunkError));

export const Product = lazy(() =>
  import('@/pages/Product').then(({ Product }) => ({ default: Product })).catch(handleCatchChunkError));

export const Direction = lazy(() =>
  import('@/pages/ProductManager').then(({ Direction }) => ({ default: Direction })).catch(handleCatchChunkError));

export const Expense = lazy(() =>
  import('@/pages/ProductManager').then(({ Expense }) => ({ default: Expense })).catch(handleCatchChunkError));

// PROVIDER
export const ApplyProducts = lazy(() =>
  import('@/pages/Provider')
    .then(({ ApplyProducts }) => ({ default: ApplyProducts }))
    .catch(handleCatchChunkError));

export const RelatedProducts = lazy(() =>
  import('@/pages/Provider')
    .then(({ RelatedProducts }) => ({ default: RelatedProducts }))
    .catch(handleCatchChunkError));

export const MyUsers = lazy(() =>
  import('@/pages/Provider')
    .then(({ MyUsers }) => ({ default: MyUsers }))
    .catch(handleCatchChunkError));

// PROVIDER QA
export const ApplyProductsQa = lazy(() =>
  import('@/pages/ProviderQA')
    .then(({ ApplyProducts }) => ({ default: ApplyProducts }))
    .catch(handleCatchChunkError));

// STOREKEEPER
export const StorekeeperMain = lazy(() =>
  import('@/pages/StorekeeperBranch/Storekeeper/StorekeeperMain')
    .then(({ StorekeeperMain }) => ({ default: StorekeeperMain }))
    .catch(handleCatchChunkError));

export const StorekeeperAddProductBasket = lazy(() =>
  import('@/pages/StorekeeperBranch/Storekeeper/StorekeeperMain')
    .then(({ StorekeeperAddProductBasket }) => ({ default: StorekeeperAddProductBasket }))
    .catch(handleCatchChunkError));

export const StorekeeperBasket = lazy(() =>
  import('@/pages/StorekeeperBranch/Storekeeper/StorekeeperMain')
    .then(({ StorekeeperBasket }) => ({ default: StorekeeperBasket }))
    .catch(handleCatchChunkError));

export const StorekeeperRequest = lazy(() =>
  import('@/pages/StorekeeperBranch/Storekeeper')
    .then(({ Request }) => ({ default: Request }))
    .catch(handleCatchChunkError));

export const StorekeeperSingleRequest = lazy(() =>
  import('@/pages/StorekeeperBranch/Storekeeper')
    .then(({ SingleRequest }) => ({ default: SingleRequest }))
    .catch(handleCatchChunkError));

// MAIN STOREKEEPER
export const MainStorekeeperProducts = lazy(() =>
  import('@/pages/StorekeeperBranch/MainStorekeeper/Products')
    .then(({ MainStorekeeperProducts }) => ({ default: MainStorekeeperProducts }))
    .catch(handleCatchChunkError));

export const MainStorekeeperCreateProduct = lazy(() =>
  import('@/pages/StorekeeperBranch/MainStorekeeper/CreateProduct')
    .then(({ CreateProduct }) => ({ default: CreateProduct }))
    .catch(handleCatchChunkError));

export const MainStorekeeperApplications = lazy(() =>
  import('@/pages/StorekeeperBranch/MainStorekeeper/Applications')
    .then(({ Applications }) => ({ default: Applications }))
    .catch(handleCatchChunkError));

export const MainStorekeeperApplicationAddEdit = lazy(() =>
  import('@/pages/StorekeeperBranch/MainStorekeeper/Applications')
    .then(({ ApplicationAddEdit }) => ({ default: ApplicationAddEdit }))
    .catch(handleCatchChunkError));

export const MainStorekeeperApplicationAddEditById = lazy(() =>
  import('@/pages/StorekeeperBranch/MainStorekeeper/Applications')
    .then(({ ApplicationAddEdit }) => ({ default: ApplicationAddEdit }))
    .catch(handleCatchChunkError));

export const MainStorekeeperStock = lazy(() =>
  import('@/pages/StorekeeperBranch/MainStorekeeper/Warehouses')
    .then(({ MainStorekeeperStock }) => ({ default: MainStorekeeperStock }))
    .catch(handleCatchChunkError));

export const MainStorekeeperCart = lazy(() =>
  import('@/pages/StorekeeperBranch/MainStorekeeper/CreateProduct/Cart')
    .then(({ MainStorekeeperCart }) => ({ default: MainStorekeeperCart }))
    .catch(handleCatchChunkError));

export const WarehouseType = lazy(() =>
  import('@/pages/StorekeeperBranch/MainStorekeeper/WarehouseType')
    .then(({ WarehouseType }) => ({ default: WarehouseType }))
    .catch(handleCatchChunkError));

export const WarehouseList = lazy(() =>
  import('@/pages/StorekeeperBranch/MainStorekeeper/WarehouseList')
    .then(({ WarehouseList }) => ({ default: WarehouseList }))
    .catch(handleCatchChunkError));

export const WarehouseProduct = lazy(() =>
  import('@/pages/StorekeeperBranch/MainStorekeeper/WarehouseList')
    .then(({ WarehouseProduct }) => ({ default: WarehouseProduct }))
    .catch(handleCatchChunkError));

// PRODUCT MANAGER
export const ProductManagerMain = lazy(() =>
  import('@/pages/ProductManager/ProductManagerMain')
    .then(({ProductManagerMain}) => ({default: ProductManagerMain}))
    .catch(handleCatchChunkError));

export const ProductManagerCategory = lazy(() =>
  import('@/pages/ProductManager/ProductManagerCategory')
    .then(({ProductManagerCategory}) => ({default: ProductManagerCategory}))
    .catch(handleCatchChunkError));

export const ProductManagerModel = lazy(() =>
  import('@/pages/ProductManager/ProductManagerModel')
    .then(({ProductManagerModel}) => ({default: ProductManagerModel}))
    .catch(handleCatchChunkError));

export const ProductManagerPricing = lazy(() =>
  import('@/pages/ProductManager/ProductManagerPricing')
    .then(({ProductManagerPricing}) => ({default: ProductManagerPricing}))
    .catch(handleCatchChunkError));

export const ProductManagerAddSets = lazy(() =>
  import('@/pages/ProductManager/ProductManagerAddSets')
    .then(({ProductManagerAddSets}) => ({default: ProductManagerAddSets}))
    .catch(handleCatchChunkError));

export const ProductManagerTissue = lazy(() =>
  import('@/pages/ProductManager/ProductManagerTissue')
    .then(({ProductManagerTissue}) => ({default: ProductManagerTissue}))
    .catch(handleCatchChunkError));

export const ProductManagerColorByTissue = lazy(() =>
  import('@/pages/ProductManager/ProductManagerTissue/ProductManagerColorByTissue')
    .then(({ProductManagerColorByTissue}) => ({default: ProductManagerColorByTissue})));

export const ProductManagerProvider = lazy(() =>
  import('@/pages/ProductManager/Provider')
    .then(({ManagerProvider}) => ({default: ManagerProvider}))
    .catch(handleCatchChunkError));

// DELIVERY ADMIN
export const Request = lazy(() =>
  import('@/pages/DeliveryAdmin/Request')
    .then(({Request}) => ({default: Request}))
    .catch(handleCatchChunkError));

export const CreateFlight = lazy(() =>
  import('@/pages/DeliveryAdmin/Request/CreateFlight')
    .then(({CreateFlight}) => ({default: CreateFlight}))
    .catch(handleCatchChunkError));

export const Courier = lazy(() =>
  import('@/pages/DeliveryAdmin/Courier')
    .then(({Courier}) => ({default: Courier}))
    .catch(handleCatchChunkError));

export const Locations = lazy(() =>
  import('@/pages/DeliveryAdmin/Locations')
    .then(({Locations}) => ({default: Locations}))
    .catch(handleCatchChunkError));

export const Reward = lazy(() =>
  import('@/pages/DeliveryAdmin/Reward')
    .then(({Reward}) => ({default: Reward}))
    .catch(handleCatchChunkError));

// MARKETER
export const Promotion = lazy(() =>
  import('@/pages/Marketer')
    .then(({Promotion}) => ({default: Promotion}))
    .catch(handleCatchChunkError));

export const SinglePromotion = lazy(() =>
  import('@/pages/Marketer')
    .then(({SinglePromotion}) => ({default: SinglePromotion}))
    .catch(handleCatchChunkError));

//MAIN CASHIER
export const Cashier = lazy(() =>
  import('@/pages/Cashier')
    .then(({Cashier}) => ({default: Cashier}))
    .catch(handleCatchChunkError));

export const Cashbox = lazy(() =>
  import('@/pages/Cashier')
    .then(({Cashbox}) => ({default: Cashbox}))
    .catch(handleCatchChunkError));

export const PaymentType = lazy(() =>
  import('@/pages/Cashier')
    .then(({PaymentType}) => ({default: PaymentType}))
    .catch(handleCatchChunkError));

//CASHIER
export const CashierRequest = lazy(() =>
  import('@/pages/Cashier')
    .then(({Requests}) => ({default: Requests}))
    .catch(handleCatchChunkError));

// SELLER DIRECTOR
export const Showroom = lazy(() =>
  import('@/pages/Seller')
    .then(({Showroom}) => ({default: Showroom}))
    .catch(handleCatchChunkError));

export const ClientInfo = lazy(() =>
  import('@/pages/Seller')
    .then(({ClientInfo}) => ({default: ClientInfo}))
    .catch(handleCatchChunkError));

export const Motivation = lazy(() =>
  import('@/pages/Seller')
    .then(({Motivation}) => ({default: Motivation}))
    .catch(handleCatchChunkError));

// MAIN SELLER
export const MySellers = lazy(() =>
  import('@/pages/Seller')
    .then(({MySellers}) => ({default: MySellers}))
    .catch(handleCatchChunkError));

// CENTRAL OPERATOR
export const Orders = lazy(() =>
  import('@/pages/CentralOperator')
    .then(({Orders}) => ({default: Orders}))
    .catch(handleCatchChunkError));

export const SingleOrder = lazy(() =>
  import('@/pages/CentralOperator')
    .then(({SingleOrder}) => ({default: SingleOrder}))
    .catch(handleCatchChunkError));

export const Changes = lazy(() =>
  import('@/pages/CentralOperator')
    .then(({Changes}) => ({default: Changes}))
    .catch(handleCatchChunkError));

// Seller
export const SellerProducts = lazy(() =>
  import('@/pages/Seller')
    .then(({SellerProducts}) => ({default: SellerProducts}))
    .catch(handleCatchChunkError));

export const SellerBasketProducts = lazy(() =>
  import('@/pages/Seller')
    .then(({ BasketProducts }) => ({ default: BasketProducts }))
    .catch(handleCatchChunkError));

export const AboutVisitedClients = lazy(() =>
  import('@/pages/Seller')
    .then(({ AboutVisitedClients }) => ({ default: AboutVisitedClients }))
    .catch(handleCatchChunkError));

export const SellerMyOrders = lazy(() =>
  import('@/pages/Seller')
    .then(({ MyOrders }) => ({ default: MyOrders }))
    .catch(handleCatchChunkError));

export const SellerMySingleOrders = lazy(() =>
  import('@/pages/Seller')
    .then(({ SingleOrder }) => ({ default: SingleOrder }))
    .catch(handleCatchChunkError));

export const OrderCheckAndSalePage = lazy(() =>
  import('@/pages/Seller')
    .then(({ OrderCheckAndSalePage }) => ({ default: OrderCheckAndSalePage }))
    .catch(handleCatchChunkError));
