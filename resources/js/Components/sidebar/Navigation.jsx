import Dropdown from "@/Components/sidebar/Dropdown";
import SidebarLink from "@/Components/sidebar/SidebarLink";
import { usePage, router } from "@inertiajs/react";

export default function NavLinks() {
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
        <nav
            className="flex flex-col flex-grow space-y-1 overflow-y-auto"
            style={{ scrollbarWidth: "none" }}
        >
            <SidebarLink
                href={route("dashboard")}
                label="Dashboard"
                icon={<i className="fa-solid fa-gauge-high"></i>}
            />

            <SidebarLink
                href={route("attendance.index")}
                label="Attendance"
                icon={<i className="fa-regular fa-calendar-check"></i>}
            />

            {["superadmin", "admin"].includes(emp_data?.emp_system_role) && (
                <div>
                    <SidebarLink
                        href={route("admin")}
                        label="Administrators"
                        icon={<i className="fa-brands fa-black-tie"></i>}
                    />
                </div>
            )}

            {/* User Info + Logout */}
            <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-gray-700 dark:text-gray-200 font-semibold flex items-center gap-2">
                    <i className="fa-regular fa-circle-user"></i>
                    {getGreeting()}, {emp_data?.emp_firstname}
                </p>

                <button
                    onClick={logout}
                    className="mt-2 w-full flex items-center justify-start gap-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                    <i className="fa-regular fa-share-from-square"></i>
                    Log out
                </button>
            </div>
        </nav>
    );
}
