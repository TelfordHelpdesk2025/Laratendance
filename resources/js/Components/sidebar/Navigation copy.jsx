import Dropdown from "@/Components/sidebar/Dropdown";
import SidebarLink from "@/Components/sidebar/SidebarLink";
import { usePage } from "@inertiajs/react";

export default function NavLinks() {
    const { emp_data } = usePage().props;
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
                        // notifications={5}
                    />
                </div>
            )}
        </nav>
    );
}
