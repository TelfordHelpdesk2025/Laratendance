import { Link, usePage, router } from "@inertiajs/react";
import { useState } from "react";

export default function NavBar() {
    const { emp_data } = usePage().props;

    const logout = () => {
        const token = localStorage.getItem("authify-token");
        localStorage.removeItem("authify-token");
        router.get(route("logout"));
        window.location.href = `http://192.168.3.201/authify/public/logout?key=${encodeURIComponent(
            token
        )}&redirect=${encodeURIComponent(route("dashboard"))}`;
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    return (
        <nav className="">
            <div className="px-4 mx-auto sm:px-6 lg:px-8 bg-gray-500">
                <div className="flex justify-end h-[50px] items-center">

                    {/* Desktop dropdown */}
                    <div className="items-center hidden md:flex mr-5 space-x-1 font-semibold">
                        <div className="dropdown dropdown-end">
                            <div
                                tabIndex={0}
                                role="button"
                                className="flex items-center m-1 space-x-2 cursor-pointer select-none text-white"
                            >
                                <i className="fa-regular fa-circle-user text-2xl"></i>
                                <span className="mt-[3px]">
                                    Hello, {getGreeting()}, {emp_data?.emp_firstname}
                                </span>
                                <i className="fa-solid fa-caret-down text-2xl"></i>
                            </div>

                            <ul
                                tabIndex={0}
                                className="p-2 shadow-md dropdown-content menu bg-base-100 rounded-box z-50 w-52 bg-gray-500"
                            >
                                <li className="text-white">
                                    <a href={route("profile.index")}>
                                        <i className="fa-regular fa-id-card"></i>
                                        <span className="mt-[3px]">Profile</span>
                                    </a>
                                </li>
                                <li className="text-white">
                                    <button
                                        onClick={logout}
                                        className="w-full text-left flex items-center gap-2"
                                    >
                                        <i className="fa-regular fa-share-from-square"></i>
                                        <span>Log out</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Mobile view */}
                    <div className="flex md:hidden items-center space-x-2">
                        <i className="fa-regular fa-circle-user text-2xl text-white"></i>
                        <span className="text-white font-semibold">
                            Hello, {getGreeting()}, {emp_data?.emp_firstname}
                        </span>
                        <button
                            onClick={logout}
                            className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                            <i className="fa-regular fa-share-from-square"></i>
                        </button>
                    </div>

                </div>
            </div>
        </nav>
    );
}
