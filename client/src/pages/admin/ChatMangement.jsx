import { useFetchData } from "6pp";
import AdminLayout from "@/components/layout/AdminLayout";
import DynamicTable from "@/components/shared/DynamicTable"; // Adjust the path based on your project structure
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { server } from "@/constants/config";
import { dashboardData } from "@/constants/sampleData";
import { useErrors } from "@/hooks/hooks";
import { transformImage } from "@/lib/features";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";

const MemberDialog = () =>{<Dialog>
  <DialogTrigger></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you absolutely sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>

}

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
        src={row.original.avatar || row.original.members[0].avatar}
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
    accessorKey: "groupChat",
    header: "Group",
  },
  {
    accessorKey: "totalMembers",
    header: "Total Members",
    enableSorting: false,
  },
  {
    accessorKey: "members",
    header: "Members",
    cell: ({ row }) => (
      <div className="text-left flex items-center gap-1">
        {row.original.totalMembers > 2 ? (
          <>
            <Avatar className="w-8 h-8">
              <AvatarImage 
                src={row.original.members[0].avatar }
                alt={row.original.members[0].name}
              />
            </Avatar>
            <span>
              {row.original.members[0].name} +{row.original.totalMembers}
            </span>
          </>
        ) : (
          <h5>No Members</h5>
        )}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "totalMessages",
    header: "Total Messages",
    enableSorting: false,
  },
  {
    accessorKey: "creator",
    header: "Creator",
    cell: ({ row }) => (
      <div className="text-left flex items-center gap-1">
        <Avatar className="w-8 h-8">
          <AvatarImage
            src={row.original.creator.avatar}
            alt={row.original.creator.name}
          />
        </Avatar>
        <span>{row.original.creator.name}</span>
      </div>
    ),
    enableSorting: false,
  },
];


const ChatMangement = () => {

  const {loading, data, error } = useFetchData(`${server}/api/v1/admin/chats`, "dashboard-chats");

  
  useErrors([{
    isError: error,
    error: error
  }])

  const [rows, setRows] = useState([]);

  useEffect(() => {
    if(data){
      setRows(
        data.chats.map((i) => ({
          ...i,
          id: i._id,
          avatar: transformImage(i.avatar, 50),
          creator: {
            name: i.creator.name,
            avatar: transformImage(i.creator.avatar, 50)
          }
        }))
      )
    }
  }, [data]);

  return (
    <AdminLayout>
      <Card className="my-10 mx-5 h-[90svh]">
        <CardHeader>
          <CardTitle className="text-5xl text-center">All Chats</CardTitle>
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

export default ChatMangement;
