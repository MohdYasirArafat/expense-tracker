
// export interface Expense {
//     _id:string,
//     title:string,
//     amount:number,
//     description:string,
//     category:string,
//     user:string
// }

export type Expense = {
  _id: string;
  title: string;
  amount: number;
  description?: string;
  category: string;
  date: string;
  user: string;
  createdAt?: string;
  updatedAt?: string;
};


export type Summary = {
  income: number;
  expense: number;
  balance: number;
};


export type CategoryData = {
  name: string;
  value: number;
};


export type ExpenseResponse = {
  expenses: Expense[];
  totalPages: number;
  currentPage: number;
};