"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

import { DataTableColumnHeader } from "@/components/custom/data-table-column-header";
import { formatNumberToIndianReadble, reverseDateString } from "@/utils/utils";
import { CustomerWithTrip } from "../_data/schema";
import { Badge } from "@/components/ui/badge";
import { statuses } from "../_data/data";
import { TripsTableRowActions } from "./trips-table-row-actions";
import { types } from "../../customers/_data/data";

export const tripsTableColumns: ColumnDef<CustomerWithTrip>[] = [
  {
    accessorKey: "index",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sr. No." />
    ),
    cell: ({ row }) => (
      <div className="max-max-w-[80px] truncate">
        <span className="truncate font-medium">
          {row.index + 1}
        </span>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const date = row.original.trip.primaryDetails.date
      return (
        <div className="flex w-[144px] space-x-2">
          <span>{reverseDateString(date)}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "trip.primaryDetails.vehicleNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vehicle Number" />
    ),
    cell: ({ row }) => {
      // const vehicleNumber = row.original.trip.primaryDetails.vehicleNumber
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("trip_primaryDetails.vehicleNumber")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "from",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="From" />
    ),
    cell: ({ row }) => {
      const from = row.original.trip.primaryDetails.from
      return (
        <div className="flex w-[95px] space-x-2">
          <span className="truncate font-medium">{from}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "to",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="To" />
    ),
    cell: ({ row }) => {
      const to = row.original.trip.primaryDetails.to
      return (
        <div className="flex w-[95px] space-x-2">
          <span className="truncate font-medium">{to}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "income",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Income Amount" />
    ),
    cell: ({ row }) => {
      const income = formatNumberToIndianReadble(row.original.trip.financeDetails.totalAmount)
      return (
        <div className="flex w-[144px] space-x-2">
          <span className="truncate font-medium">₹ {income}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "due",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Due Amount" />
    ),
    cell: ({ row }) => {
      const due = formatNumberToIndianReadble(row.original.trip.incomeDetails?.dueAmount || 0)
      return (
        <div className="flex w-[144px] space-x-2">
          <span className="truncate font-medium">₹ {due}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "lrNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="LR. No." />
    ),
    cell: ({ row }) => {
      const lrNumber = row.original.trip.primaryDetails?.lrNumber ?? "N/A";
      return (
        <div className="flex w-[144px] space-x-2">
          <span className="truncate font-medium">{lrNumber}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "trip.primaryDetails.status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find((status) => status.value === row.original.trip.primaryDetails.status);

      if (!status) {
        return null;
      }

      return (
        <div className="flex w-[144px] items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span className="truncate font-medium">{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <TripsTableRowActions row={row} />,
  },
];