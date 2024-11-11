import { statuses } from "./data";

export const filters = [
  {
    column: "primaryDetails_status",
    title: "Status",
    options: statuses.map(({ label, value }) => ({
      label,
      value
    }))
  }
]