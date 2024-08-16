import { GroupIcon, LogOutIcon, LucideUserCog2, MenuIcon, MessageCircle, XIcon } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader } from '../ui/drawer';
import { useLocation, Link as LinkComponent, Navigate } from 'react-router-dom';
import { LayoutDashboardIcon } from 'lucide-react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { adminLogout } from '@/redux/thunks/admin';
import { ModeToggle } from '../ui/mode-toggler';
import { useTheme } from '../ui/theme-provider';

const Link = styled(LinkComponent)`
    text-decoration: none;
    border-radius: 2rem;
    padding: 1rem 2rem;
`


const adminTabs = [
    {
        name: 'Dashboard',
        path: '/admin/dashboard',
        icon: <LayoutDashboardIcon />
    },
    {
        name: 'Users',
        path: '/admin/users',
        icon: <LucideUserCog2/>
    },
    {
        name: 'Chats',
        path: '/admin/chats',
        icon: <GroupIcon />
    },
    {
        name: 'Messages',
        path: '/admin/messages',
        icon: <MessageCircle />
    },
];

const Sidebar = () => {

    const {theme, systemTheme} = useTheme();

    const mode = theme === "dark" || theme === "system" && systemTheme === "dark" ? "dark" : "light"

    const location = useLocation();

    const dispatch = useDispatch();

    const logoutHandler = ()=>{
        dispatch(adminLogout())
    }

    return (
        
        <div className="flex flex-col p-12 gap-12">
            <h4 className="text-2xl">AppName</h4>
            <div className='flex flex-col gap-4'>
                {adminTabs.map((tab) => {
                    const isActive = location.pathname === tab.path;
                    return (
                        <Link key={tab.path} to={tab.path} {...isActive & mode==="light" && {style:{ backgroundColor:"black", color:"white"}}} {...isActive & mode==="dark" && {style:{ backgroundColor:"white", color:"black"}}}>
                    <div className="flex gap-4">
                       {tab.icon}
                       <h5>{tab.name}</h5>
                    </div>
                       </Link>
                    );
                })}
                <Link onClick={logoutHandler}>
                    <div className="flex gap-4 dark:text-white">
                        <LogOutIcon/>
                       <h5>Logout</h5>
                    </div>
                </Link>
                <div className="flex gap-4 items-center">
                        <ModeToggle variant={"icon"} className=" shadow-none border-none px-1 ml-6"/>
                       <h5>Toggle Mode</h5>
                </div>
            </div>   
        </div>
    );
};

const AdminLayout = ({ children }) => {
    const { isAdmin} = useSelector(state => state.auth)
    const [isMobile, setIsMobile] = useState(false);

    const handleMobile = () => setIsMobile(!isMobile);

    if (!isAdmin) return <Navigate to="/admin" />;

    return (
        <div className="grid min-h-[100vh] grid-cols-12">
            <div className="block fixed right-4 top-4 md:hidden">
                <Button className="px-2 rounded-full" onClick={handleMobile}>
                    {isMobile ? <XIcon /> : <MenuIcon />}
                </Button>
            </div>
            <div className='col-span-3'>
                <Sidebar />
            </div>
            <div className='col-span-9'>{children}</div>
            <Drawer
                open={isMobile}
                onClose={() => setIsMobile(false)}
                className="fixed inset-0 z-50 flex justify-end"
            >
                <DrawerContent className="w-full bg-white shadow-lg block md:hidden">
                    <DrawerHeader>
                        <DrawerDescription>
                            <Sidebar />
                        </DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button
                                className="absolute top-3 right-4 bg-slate-200 rounded-full px-2"
                                variant="outline"
                                onClick={() => setIsMobile(false)}
                            >
                                <XIcon />
                            </Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    );
};

export default AdminLayout;
