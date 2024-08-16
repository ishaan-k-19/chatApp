import { useFetchData } from '6pp'
import AdminLayout from '@/components/layout/AdminLayout'
import { DoughnutChart, LineChart } from '@/components/specific/Charts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Widget from '@/components/ui/widget'
import { server } from '@/constants/config'
import { useErrors } from '@/hooks/hooks'
import { BellIcon, MessageCircle, ShieldCheckIcon, UserIcon, UserRound, UserRoundCogIcon, UsersIcon, UsersRoundIcon } from 'lucide-react'
import moment from 'moment'
import React from 'react'

const Dashboard = () => {

  const {loading, data, error } = useFetchData(`${server}/api/v1/admin/stats`, "dashboard-stats");

  
  const {stats} = data || {};
  
  useErrors([{
    isError: error,
    error: error
  }])

  const Appbar = <Card className="my-5 mx-7">
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <div className='flex gap-4 items-center'>
      <UserRoundCogIcon/>
      <Input/>
      <Button variant="secondary">Search</Button>
        </div>
      <div className='flex items-center gap-3'>
      <h5>{moment().format("dddd, D MMMM YYYY")}</h5>
      <BellIcon/>
      </div>
      </CardTitle>
    </CardHeader>
  </Card>
  
  const Widgets = <div className='flex justify-between gap-4 items-center w-full'>
      <Widget title={"Users"} value={stats?.usersCount} Icon={<UserRound/>}/>
      <Widget title={"Chats"} value={stats?.totalChatsCount} Icon={<UsersRoundIcon/>}/>
      <Widget title={"Messages"} value={stats?.messagesCount} Icon={<MessageCircle/>}/>
    </div>
  


  return (
    <AdminLayout>
      <div className="container">
        {
          Appbar
        }
        <div className='flex flex-wrap my-5 w-full justify-center items-stretch gap-4'>
          <Card className="w-3/5">
            <CardHeader>
              <CardTitle>
                <h4>Last Messages</h4>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {<LineChart value={stats?.messagesChart}/>}
            </CardContent>
          </Card>
          <Card className="flex items-center justify-center relative w-2/6">
            <CardContent>
                {<DoughnutChart labels={["Single Chats", "Group Chats"]} value={[stats?.totalChatsCount - stats?.groupsCount || 0 , stats?.groupsCount || 0]}/>}
                <div className="flex justify-center items-center absolute top-1/2 left-[40%]">
                    <UsersIcon/> <h5>vs</h5> <UserIcon/>
                </div>
            </CardContent>
          </Card>
        </div>
        <div className='px-7'>
        {Widgets}
        </div>
      </div>
    </AdminLayout>
  )

}



export default Dashboard
