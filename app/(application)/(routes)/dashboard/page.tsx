"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Stats } from "./_components/stats";
import { IncomeExpenseGraph } from "./_components/income-expense-graph";
import { RecentTrip } from "./_components/recent-trip";
import { getUserAllTrips } from "@/server/trips";
import { Customer } from "../customers/_data/schema";
import { dummyGraphData } from "./_data/data";
import { TripsGraph } from "./_components/trips-graph";
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useState } from "react";

export const revalidate = 0
export const dynamic = 'force-dynamic'

function isDateInCurrentMonth(inputDateString: string): boolean {
  const inputDate = new Date(inputDateString);

  const currentDate = new Date();

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const inputYear = inputDate.getFullYear();
  const inputMonth = inputDate.getMonth();

  return currentYear === inputYear && currentMonth === inputMonth;
}

function getGraphData(customers: Customer[]) {
  const graphData = dummyGraphData;
  const currentYear = new Date().getFullYear();

  customers.forEach(customer => {
    customer.trips?.forEach(trip => {
      const tripDate = new Date(trip.primaryDetails.date);
      const tripYear = tripDate.getFullYear();

      if (tripYear === currentYear) {
        const monthIndex = tripDate.getMonth();
        graphData[monthIndex].income += trip.financeDetails.totalAmount;
        graphData[monthIndex].expense += (trip.expenseDetails?.totalAmount ?? 0);
        graphData[monthIndex].trips += 1;
      }
    });
  });

  return graphData;
}

async function getTrips(){
  const response = await getUserAllTrips()
  if(response?.success){
    return response.data?.customers as Customer[]
  }
  return [] as Customer[]
}

function getStats(graphData: { name: string; income: number; expense: number; trips: number }[]) {
  const totalTrips = graphData.reduce((accumulator, current) => accumulator + current.trips, 0) || 0
  const totalIncome = graphData.reduce((accumulator, current) => accumulator + current.income, 0) || 0
  const totalExpense = graphData.reduce((accumulator, current) => accumulator + current.expense, 0) || 0
  const netProfitAndLoss = (totalIncome - totalExpense) ?? 0

  return { totalTrips, totalIncome, totalExpense, netProfitAndLoss }
}

export default function DashboardPage(){

  const [customers, setCustomers] = useState<Customer[]>([])
  const [thisMonthTrips, setThisMonthTrips] = useState<Customer[]>([])

  useEffect(() => {
    async function fetchData(){
      setCustomers([])
      const findCustomers = await getTrips()
      const findThisMonthTrips = findCustomers
        .filter((customer: Customer) =>
          customer?.trips?.some((trip) => isDateInCurrentMonth(trip.primaryDetails.date))
        )
        .map((customer) => ({
          ...customer,
          trips: customer?.trips?.filter((trip) =>
            isDateInCurrentMonth(trip.primaryDetails.date)
          ),
        }));
      
      setCustomers(findCustomers)
      setThisMonthTrips(findThisMonthTrips)
    }
    fetchData()
  }, [])


  const graphData = getGraphData(customers)

  const { totalTrips, totalIncome, totalExpense, netProfitAndLoss } = getStats(graphData)

  return (
    <div className="h-full flex-1 flex-col space-y-8 flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Here&apos;s is your dashboard information!
          </p>
        </div>
      </div>
      <Stats totalTrips={totalTrips} totalIncome={totalIncome} totalExpense={totalExpense} netProfitAndLoss={netProfitAndLoss} />
      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-xl">Trips</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <TripsGraph graphData={graphData} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-xl">Recent Trips</CardTitle>
            <CardDescription>You made {thisMonthTrips.length} trips this month.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {thisMonthTrips.map((customer, index: number) => (
                <div key={index} className="mb-4">
                  <RecentTrip thisMonthTrips={customer} />
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle className="text-xl">Income & Expense</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <IncomeExpenseGraph graphData={graphData} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}