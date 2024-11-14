export interface ICombinationParams {
  pageSize: number;
  pageNumber: number;
}

// {
//   "count": 500,
//   "combinationList": [
//     {
//       "id": "7d7914d2-8a30-45e9-a79a-343fdbb0a0e8",
//       "name": "combination name",
//       "price": 1000,
//       "quantity": 5,
//       "status": "combination status"
//     }
//   ],
//   "pageCount": 50,
//   "pageNumber": 1,
//   "pageSize": 10
// }

export interface IGetCombination {
  count: number;
  combinationList: ICombination[];
}

export interface ICombination {
  id: string;
  name: string;
  price: number;
  quantity: number;
  status: string;
}
