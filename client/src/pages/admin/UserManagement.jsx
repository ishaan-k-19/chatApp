import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DynamicTable from "@/components/shared/DynamicTable"; // Adjust the path based on your project structure
import { dashboardData } from "@/constants/sampleData";
import { AtSignIcon } from "lucide-react";
import { useFetchData } from "6pp";
import { server } from "@/constants/config";
import { useErrors } from "@/hooks/hooks";
import { transformImage } from "@/lib/features";

const columns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "avatar",
    header: "Avatar",
    cell: ({ row }) => (
      <img
        src={row.original.avatar}
        alt={`${row.original.name}'s avatar`}
        className="w-10 h-10 rounded-full"
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => <div className="text-left flex items-center gap-1"><AtSignIcon size="15"/>{row.original.username}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "friends",
    header: "Friends",
    enableSorting: true,
  },
  {
    accessorKey: "groups",
    header: "Groups",
  },
];

const UserManagement = () => {
  const {loading, data, error } = useFetchData(`${server}/api/v1/admin/users`, "dashboard-users");

  
  useErrors([{
    isError: error,
    error: error
  }])

  const [rows, setRows] = useState([]);

  useEffect(() => {

    if(data){
      setRows(
        data.users.map((i) => ({
          ...i,
          id: i._id,
          avatar: transformImage(i.avatar, 50)
        }))
      )
    }
  }, [data]);

  return (
    <AdminLayout>
      <Card className="my-10 mx-5 h-[90svh]">
        <CardHeader>
          <CardTitle className="text-5xl text-center">All Messages</CardTitle>
        </CardHeader>
        <CardContent className="p-10">
          <div>
            <DynamicTable columns={columns} data={rows} />
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default UserManagement;
