/* eslint-disable import/namespace */
import React, {Suspense} from 'react';
import {Navigate, useRoutes} from 'react-router-dom';
import {Loading} from '@/components';
import {ROUTES} from '@/constants';
import {Layout} from '@/modules/Layout';
import {
  AboutVisitedClients,
  AddUser,
  ApplyProducts,
  ApplyProductsQa,
  Base,
  Cashbox,
  Cashier,
  CashierRequest,
  Categories,
  Changes,
  ClientInfo,
  Companies,
  Courier,
  CreateFlight,
  Direction,
  Expense,
  Home, Locations, Login,
  MainStorekeeperApplicationAddEdit,
  MainStorekeeperApplicationAddEditById,
  MainStorekeeperApplications,
  MainStorekeeperCart,
  MainStorekeeperCreateProduct,
  MainStorekeeperProducts,
  MainStorekeeperStock,
  Model,
  Motivation,
  MyLogs,
  MyProfileHome,
  MySellers,
  MyUsers,
  OrderCheckAndSalePage,
  Orders,
  PaymentType,
  Process, Product,
  ProductManagerAddSets,
  ProductManagerCategory,
  ProductManagerColorByTissue,
  ProductManagerMain,
  ProductManagerModel,
  ProductManagerPricing,
  ProductManagerProvider,
  ProductManagerTissue,
  Promotion,
  RelatedProducts,
  Request,
  Reward,
  Roles,
  SellerBasketProducts,
  SellerMyOrders,
  SellerMySingleOrders,
  SellerProducts,
  Showroom,
  SingleOrder,
  SinglePromotion,
  StorekeeperAddProductBasket,
  StorekeeperBasket,
  StorekeeperMain,
  StorekeeperRequest,
  StorekeeperSingleRequest,
  UserEdit,
  WarehouseList,
  WarehouseProduct,
  WarehouseType,
  WorkOn,
} from './lazy';
import {ProtectedRoutes} from './ProtectedRoutes';
import {PublicRoutes} from './PublicRoutes';

type Props = {
  isAuth: boolean | null;
};

export const Router = ({isAuth}: Props) => useRoutes([
  {
    path: ROUTES.home,
    element: <ProtectedRoutes isAuth={isAuth} />,
    children: [
      {
        path: ROUTES.home,
        element: <Layout />,
        children: [
          // ADMIN
          {
            element: <Suspense fallback={<Loading />}><MyProfileHome /></Suspense>,
            path: ROUTES.home,
            index: true,
          },
          {
            element: <Suspense fallback={<Loading />}><Home /></Suspense>,
            path: ROUTES.users,
          },
          {
            element: <Suspense fallback={<Loading />}><UserEdit /></Suspense>,
            path: ROUTES.userEdit,
          },
          {
            element: <Suspense fallback={<Loading />}><AddUser /></Suspense>,
            path: ROUTES.userAdd,
          },
          {
            element: <Suspense fallback={<Loading />}><Companies /></Suspense>,
            path: ROUTES.companys,
          },
          {
            element: <Suspense fallback={<Loading />}><Roles /></Suspense>,
            path: ROUTES.roles,
          },
          // PMS INJENER
          {
            element: <Suspense fallback={<Loading />}><Process /></Suspense>,
            path: ROUTES.process,
          },
          {
            element: <Suspense fallback={<Loading />}><Categories /></Suspense>,
            path: ROUTES.category,
          },
          {
            element: <Suspense fallback={<Loading />}><MyLogs /></Suspense>,
            path: ROUTES.tasks,
          },
          {
            element: <Suspense fallback={<Loading />}><Model /></Suspense>,
            path: ROUTES.model,
          },
          {
            element: <Suspense fallback={<Loading />}><Product /></Suspense>,
            path: ROUTES.product,
          },
          {
            element: <Suspense fallback={<Loading />}><WorkOn /></Suspense>,
            path: ROUTES.workOn,
          },
          {
            element: <Suspense fallback={<Loading />}><Base /></Suspense>,
            path: ROUTES.base,
          },

          // PMS MENEDGER
          {
            element: <Suspense fallback={<Loading />}><Categories /></Suspense>,
            path: ROUTES.pmsMrCategory,
          },

          // PROVIDER
          {
            element: <Suspense fallback={<Loading />} ><ApplyProducts /></Suspense>,
            path: ROUTES.providerApplyProducts,
          },
          {
            element: <Suspense fallback={<Loading />} ><RelatedProducts /></Suspense>,
            path: ROUTES.providerRelatedProducts,
          },
          {
            element: <Suspense fallback={<Loading />} ><MyUsers /></Suspense>,
            path: ROUTES.providerMyUsers,
          },

          // PROVIDER QA
          {
            element: <Suspense fallback={<Loading />} ><ApplyProductsQa /></Suspense>,
            path: ROUTES.providerQaApplyProducts,
          },

          // STOREKEEPER
          {
            element: <Suspense fallback={<Loading />} ><StorekeeperMain /></Suspense>,
            path: ROUTES.storekeeperMain,
          },
          {
            element: <Suspense fallback={<Loading />} ><StorekeeperAddProductBasket /></Suspense>,
            path: ROUTES.storekeeperAddProductBasket,
          },
          {
            element: <Suspense fallback={<Loading />} ><StorekeeperBasket /></Suspense>,
            path: ROUTES.storekeeperBasket,
          },
          {
            element: <Suspense fallback={<Loading />} ><StorekeeperRequest /></Suspense>,
            path: ROUTES.storekeeperRequest,
          },
          {
            element: <Suspense fallback={<Loading />} ><StorekeeperSingleRequest /></Suspense>,
            path: ROUTES.storekeeperSingleRequest,
          },
          // MAIN-STOREKEEPER
          {
            element: <Suspense fallback={<Loading />}><MainStorekeeperProducts /></Suspense>,
            path: ROUTES.mainStorekeeperMyOrder,
          },
          {
            element: <Suspense fallback={<Loading />}><MainStorekeeperStock /></Suspense>,
            path: ROUTES.mainStorekeeperStock,
          },
          {
            element: <Suspense fallback={<Loading />}><MainStorekeeperCreateProduct /></Suspense>,
            path: ROUTES.mainStorekeeperCreateProduct,
          },
          {
            element: <Suspense fallback={<Loading />}><MainStorekeeperCart /></Suspense>,
            path: ROUTES.mainStorekeeperCart,
          },

          {
            element: <Suspense fallback={<Loading />}><MainStorekeeperApplications /></Suspense>,
            path: ROUTES.mainStorekeeperApplications,
          },
          {
            element: <Suspense fallback={<Loading />}><MainStorekeeperApplicationAddEdit /></Suspense>,
            path: ROUTES.mainStorekeeperApplicationAddEdit,
          },
          {
            element: <Suspense fallback={<Loading />}><MainStorekeeperApplicationAddEditById /></Suspense>,
            path: ROUTES.mainStorekeeperApplicationAddEditById,
          },
          {
            element: <Suspense fallback={<Loading />}><WarehouseType /></Suspense>,
            path: ROUTES.mainStorekeeperWarehouseType,
          },
          {
            element: <Suspense fallback={<Loading />}><WarehouseList /></Suspense>,
            path: ROUTES.mainStorekeeperWarehouseList,
          },
          {
            element: <Suspense fallback={<Loading />}><WarehouseProduct /></Suspense>,
            path: ROUTES.mainStorekeeperWarehouseProducts,
          },

          // PRODUCT MANAGER
          {
            element: <Suspense fallback={<Loading />}><ProductManagerMain /></Suspense>,
            path: ROUTES.productManagerMain,
          },
          {
            element: <Suspense fallback={<Loading />} ><ProductManagerCategory /></Suspense>,
            path: ROUTES.productManagerCategory,
          },
          {
            element: <Suspense fallback={<Loading />} ><ProductManagerModel /></Suspense>,
            path: ROUTES.productManagerModel,
          },
          {
            element: <Suspense fallback={<Loading />} ><ProductManagerPricing /></Suspense>,
            path: ROUTES.productManagerPricing,
          },
          {
            element: <Suspense fallback={<Loading />}><ProductManagerAddSets /></Suspense>,
            path: ROUTES.productManagerSets,
          },
          {
            element: <Suspense fallback={<Loading />}><ProductManagerTissue /></Suspense>,
            path: ROUTES.productManagerTissue,
          },
          {
            element: <Suspense fallback={<Loading />}><ProductManagerColorByTissue /></Suspense>,
            path: ROUTES.productManagerColorByTissue,
          },
          {
            element: <Suspense fallback={<Loading />}><ProductManagerProvider /></Suspense>,
            path: ROUTES.productManagerProvider,
          },
          {
            element: <Suspense fallback={<Loading />}><Direction /></Suspense>,
            path: ROUTES.pmsManagerDirection,
          },
          {
            element: <Suspense fallback={<Loading />}><Expense /></Suspense>,
            path: ROUTES.pmsManagerExpense,
          },
          // DELIVERY ADMIN
          {
            element: <Suspense fallback={<Loading />}><Request /></Suspense>,
            path: ROUTES.dmsRequest,
          },
          {
            element: <Suspense fallback={<Loading />}><CreateFlight /></Suspense>,
            path: ROUTES.dmsCreateFlight,
          },
          {
            element: <Suspense fallback={<Loading />}><Courier /></Suspense>,
            path: ROUTES.dmsCourier,
          },
          {
            element: <Suspense fallback={<Loading />}><Locations /></Suspense>,
            path: ROUTES.dmsLocation,
          },
          {
            element: <Suspense fallback={<Loading />}><Reward /></Suspense>,
            path: ROUTES.dmsReward,
          },

          // MARKETER
          {
            element: <Suspense fallback={<Loading />}><Promotion /></Suspense>,
            path: ROUTES.marketerPromotion,
          },
          {
            element: <Suspense fallback={<Loading />}><SinglePromotion /></Suspense>,
            path: ROUTES.marketerSinglePromotion,
          },
          // MAIN CASHIER
          {
            element: <Suspense fallback={<Loading />}><Cashier /></Suspense>,
            path: ROUTES.mainCashierCashiers,
          },
          {
            element: <Suspense fallback={<Loading />}><Cashbox /></Suspense>,
            path: ROUTES.mainCashierCashbox,
          },
          {
            element: <Suspense fallback={<Loading />}><PaymentType /></Suspense>,
            path: ROUTES.mainCashierPaymentType,
          },
          // CASHIER
          {
            element: <Suspense fallback={<Loading />}><CashierRequest /></Suspense>,
            path: ROUTES.cashierRequests,
          },
          // SELLER DIRECTOR
          {
            element: <Suspense fallback={<Loading />}><Showroom /></Suspense>,
            path: ROUTES.sellerDirectorShowrooms,
          },
          {
            element: <Suspense fallback={<Loading />}><ClientInfo /></Suspense>,
            path: ROUTES.sellerDirectorClientInfo,
          },
          {
            element: <Suspense fallback={<Loading />}><Motivation /></Suspense>,
            path: ROUTES.sellerDirectorMotivation,
          },
          // MAIN SELLER
          {
            element: <Suspense fallback={<Loading />}><MySellers /></Suspense>,
            path: ROUTES.mainSellerUsers,
          },
          // CENTRAL OPERATOR
          {
            element: <Suspense fallback={<Loading />}><Orders /></Suspense>,
            path: ROUTES.centarlOperatorOrders,
          },
          {
            element: <Suspense fallback={<Loading />}><SingleOrder /></Suspense>,
            path: ROUTES.centarlOperatorSingleOrder,
          },
          {
            element: <Suspense fallback={<Loading />}><Changes /></Suspense>,
            path: ROUTES.centarlOperatorChanges,
          },
          // SELLER
          {
            element: <Suspense fallback={<Loading />}><SellerProducts /></Suspense>,
            path: ROUTES.sellerProducts,
          },
          {
            element: <Suspense fallback={<Loading />}><SellerBasketProducts /></Suspense>,
            path: ROUTES.sellerBasketProducts,
          },
          {
            element: <Suspense fallback={<Loading />}><AboutVisitedClients /></Suspense>,
            path: ROUTES.sellerAboutVisitedClients,
          },
          {
            element: <Suspense fallback={<Loading />}><SellerMyOrders /></Suspense>,
            path: ROUTES.sellerMyOrders,
          },
          {
            element: <Suspense fallback={<Loading />}><SellerMySingleOrders /></Suspense>,
            path: ROUTES.sellerMySingleOrder,
          },
          {
            element: <Suspense fallback={<Loading />}><OrderCheckAndSalePage /></Suspense>,
            path: ROUTES.sellerOrderCheckAndSale,
          },
          // SETTING ROUTES
          {
            element: <Navigate to={ROUTES.home} />,
            path: '*',
          },
          {
            element: <Navigate to={ROUTES.home} />,
            path: '/',
          },
        ],
      },
    ],
  },
  {
    path: ROUTES.signIn,
    element: <PublicRoutes isAuth={isAuth} />,
    children: [
      {
        index: true,
        element: <Suspense fallback={<Loading />}><Login /></Suspense>,
      },
    ],
  },
]);
