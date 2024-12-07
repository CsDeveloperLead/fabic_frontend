import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { jwtDecode } from "jwt-decode";
import AuthContext from '../AuthContext'
import { useNavigate } from 'react-router-dom'

const backend = import.meta.env.VITE_BACKEND_URL

function AdminDashboard() {
    const [userType, setUserType] = useState("all")
    const [totalUsers, setTotalUsers] = useState([])
    const { isAuthenticated } = useContext(AuthContext)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 20;
    const navigate = useNavigate()

    const sortedOrders = [...totalUsers]
        .filter((user) => (userType === "all" ? true : user.role === userType))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = sortedOrders.slice(indexOfFirstItem, indexOfLastItem);

    async function fetchAllUsers() {
        try {
            const response = await axios.post(`${backend}/api/v1/admin/all-users`)
            setTotalUsers(response.data)

        } catch (error) {
            console.log("Error while fetching all Users:", error);
        }
    }

    async function changeRoleToStaff(id) {
        try {
            const response = await axios.post(`${backend}/api/v1/admin/change-role-staff`, { id })
            alert("Role change to Staff successful")
            fetchAllUsers()
        } catch (error) {
            console.log("Error while changing role to staff:", error);

        }
    }

    async function changeRoleToCustomer(id) {
        try {
            const response = await axios.post(`${backend}/api/v1/admin/change-role-customer`, { id })
            alert("Role change to customer successful")
            fetchAllUsers()
        } catch (error) {
            console.log("Error while changing role to Customer:", error);

        }
    }

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            const decodedToken = jwtDecode(token)
            if (decodedToken.role !== 'admin') {
                navigate('/')
            }
        } else {
            navigate('/')
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) fetchAllUsers()
    }, [isAuthenticated]);

    return (
        <div className='w-full h-auto flex flex-col'>
            <h1 className='text-center text-3xl font-bold mt-10'>Total Users</h1>
            <div className='w-full h-auto flex justify-center items-center mt-10'>
                {
                    ["all", "customer", "staff"].map((item, index) => (
                        <div key={index} className='w-24 h-auto flex justify-center items-center'>
                            <span
                                onClick={() => setUserType(item)}
                                className={`${userType === item ? 'bg-blue-500 text-white border-blue-500' : ''} px-4 py-2 rounded-full flex justify-center items-center border-2 border-black cursor-pointer`}
                            >
                                {item.charAt(0).toUpperCase() + item.slice(1)}
                            </span>
                        </div>
                    ))
                }
            </div>
            <div className='w-full h-auto flex flex-col mt-10'>
                {totalUsers.length > 0 ? (
                    <table className="min-w-full overflow-x-scroll">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User ID
                                </th>
                                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Phone
                                </th>
                                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role Change
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50">
                                    <td className="py-4 px-4 whitespace-nowrap text-sm text-center">
                                        {user._id}
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap text-sm text-center">
                                        {user.name}
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap text-sm text-center">
                                        {user.phone}
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap text-sm text-center">
                                        {user.email}
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap text-sm text-center">
                                        {user.role}
                                    </td>
                                    {
                                        user.role === 'customer'
                                            ? <td onClick={() => changeRoleToStaff(user._id)} className="py-4 px-4 md:hover:underline cursor-pointer whitespace-nowrap text-sm text-center text-blue-500">
                                                Change to Staff
                                            </td>
                                            : <td onClick={() => changeRoleToCustomer(user._id)} className="py-4 px-4 md:hover:underline cursor-pointer whitespace-nowrap text-sm text-center text-blue-500">
                                                Change to Customer
                                            </td>
                                    }
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="w-full flex justify-center text-2xl font-bold my-10 text-[#1A3A37] font-marcellus">
                        Loading Users...
                    </p>
                )}
            </div>
        </div>
    )
}

export default AdminDashboard