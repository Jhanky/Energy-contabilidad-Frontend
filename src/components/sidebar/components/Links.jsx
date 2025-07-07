/* eslint-disable */
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MdKeyboardArrowDown } from "react-icons/md";
import { MdDashboard, MdPerson, MdShoppingCart, MdChat } from "react-icons/md";
import DashIcon from "components/icons/DashIcon";
import { useAuth } from "context/AuthContext";
// chakra imports

export function SidebarLinks(props) {
  // Chakra color mode
  let location = useLocation();
  const { routes, collapsed } = props;
  const { user } = useAuth();
  const [openSubmenus, setOpenSubmenus] = useState({});

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname.includes(routeName);
  };

  const toggleSubmenu = (index) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const hasAccess = (route) => {
    // Si no hay roles definidos, permitir acceso
    if (!route.allowedRoles) return true;
    
    // Si el usuario no tiene rol, denegar acceso
    if (!user?.role) return false;
    
    // Verificar si el rol del usuario está en los roles permitidos
    return route.allowedRoles.includes(user.role);
  };

  const createLinks = (routes) => {
    return routes
      .filter(route => hasAccess(route))
      .map((route, index) => {
        if (
          route.layout === "/admin" ||
          route.layout === "/auth" ||
          route.layout === "/rtl"
        ) {
          return (
            <div key={index}>
              {route.submenu ? (
                <div className="relative mb-3">
                  <div
                    className={`flex w-full items-center justify-between ${
                      collapsed ? "px-4" : "px-8"
                    } ${
                      activeRoute(route.path)
                        ? "bg-green-50 text-green-600 dark:bg-navy-700 dark:text-white"
                        : "text-gray-800 dark:text-gray-200"
                    }`}
                    onClick={() => toggleSubmenu(index)}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`${
                          activeRoute(route.path) === true
                            ? "font-bold text-green-600 dark:text-white"
                            : "font-medium text-gray-800"
                        }`}
                      >
                        {route.icon ? route.icon : <DashIcon />}{" "}
                      </span>
                      {!collapsed && (
                        <p
                          className={`leading-1 ml-4 flex ${
                            activeRoute(route.path) === true
                              ? "font-bold text-gray-800 dark:text-white"
                              : "font-medium text-gray-800"
                          }`}
                        >
                          {route.name}
                        </p>
                      )}
                    </div>
                    {route.submenu && !collapsed && (
                      <div
                        className={`flex items-center ${
                          openSubmenus[index] ? "rotate-180" : ""
                        } transition-transform duration-200`}
                      >
                        <MdKeyboardArrowDown className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  {openSubmenus[index] && !collapsed && (
                    <div className="mt-2 space-y-2">
                      {route.submenu
                        .filter(subItem => hasAccess(subItem))
                        .map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            to={`${route.layout}/${subItem.path}`}
                            className={`block ${
                              location.pathname === `${route.layout}/${subItem.path}`
                                ? "bg-green-50 text-green-600 dark:bg-navy-700 dark:text-white"
                                : "text-gray-800 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-navy-700"
                            }`}
                          >
                            <div className="relative mb-3 flex hover:cursor-pointer">
                              <li className="my-[3px] flex cursor-pointer items-center px-8">
                                <span
                                  className={`${
                                    activeRoute(subItem.path) === true
                                      ? "font-bold text-green-600 dark:text-white"
                                      : "font-medium text-gray-800"
                                  }`}
                                >
                                  {subItem.icon ? subItem.icon : <DashIcon />}{" "}
                                </span>
                                <p
                                  className={`leading-1 ml-4 flex ${
                                    activeRoute(subItem.path) === true
                                      ? "font-bold text-gray-800 dark:text-white"
                                      : "font-medium text-gray-800"
                                  }`}
                                >
                                  {subItem.name}
                                </p>
                              </li>
                              {activeRoute(subItem.path) ? (
                                <div className="absolute right-0 top-px h-9 w-1 rounded-lg bg-green-600 dark:bg-green-400" />
                              ) : null}
                            </div>
                          </Link>
                        ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link key={index} to={route.layout + "/" + route.path}>
                  <div className="relative mb-3 flex hover:cursor-pointer">
                    <li
                      className={`my-[3px] flex cursor-pointer items-center ${
                        collapsed ? "px-4" : "px-8"
                      }`}
                      key={index}
                    >
                      <span
                        className={`${
                          activeRoute(route.path) === true
                            ? "font-bold text-green-600 dark:text-white"
                            : "font-medium text-gray-800"
                        }`}
                      >
                        {route.icon ? route.icon : <DashIcon />}{" "}
                      </span>
                      {!collapsed && (
                        <p
                          className={`leading-1 ml-4 flex ${
                            activeRoute(route.path) === true
                              ? "font-bold text-gray-800 dark:text-white"
                              : "font-medium text-gray-800"
                          }`}
                        >
                          {route.name}
                        </p>
                      )}
                    </li>
                    {activeRoute(route.path) ? (
                      <div className="absolute right-0 top-px h-9 w-1 rounded-lg bg-green-600 dark:bg-green-400" />
                    ) : null}
                  </div>
                </Link>
              )}
            </div>
          );
        }
      });
  };
  // BRAND
  return createLinks(routes);
}

export default SidebarLinks;
