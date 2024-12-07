import { useEffect, useState } from "react";
import AddNewButton from "./Button";
import OrderForm from "./Order";
import { AiOutlineCloseCircle } from "react-icons/ai";
import axios from "axios";
import SingleOrder from "./SingleOrder";
import { jwtDecode } from "jwt-decode";
import AuthContext from "./AuthContext";
import { useContext } from "react";
import { useNavigate } from 'react-router-dom'

const backend = import.meta.env.VITE_BACKEND_URL;

const StaffDashboard = () => {
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  const [singleOrderDetails, setSingleOrderDetails] = useState({});
  const [orders, setOrders] = useState([]);
  const { isAuthenticated } = useContext(AuthContext)
  const navigate = useNavigate()

  const openOrderForm = () => {
    setIsOrderFormOpen(true);
  };

  const closeOrderForm = () => {
    setIsOrderFormOpen(false);
  };

  function handleView(item) {
    setIsOrderDetailsOpen(true)
    setSingleOrderDetails(item)
  }

  function handleOrderPopUpClose() {
    setIsOrderDetailsOpen(false)
    setSingleOrderDetails('')
  }

  async function getOrders() {
    try {
      const response = await axios.get(`${backend}/api/v1/orders/get-orders`)
      setOrders(response.data)
    } catch (error) {
      console.log("Error while getting products ", error);
    }
  }

  useEffect(() => {
    getOrders();
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const decodedToken = jwtDecode(token)
      console.log(decodedToken.role);
      
      if (decodedToken.role === 'customer') {
        navigate('/')
      }
    } else {
      navigate('/')
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) getOrders()
  }, [isAuthenticated]);

  return (
    <div className="mx-10 mt-10 flex flex-col items-center">
      <h1 className="text-4xl font-bold my-10">Staff Dashboard</h1>
      <div className="w-full shadow-md h-[150px] rounded-3xl flex justify-center items-center p-4 border drop-shadow-md border-gray-400">
        <div className="flex flex-col items-center">
          <AddNewButton onClick={openOrderForm} />
          <span className="px-6 mt-4 text-2xl md:text-3xl font-bold">Create New Order</span>
        </div>
      </div>
      <div className="w-full h-auto flex flex-col mt-7">
        {
          orders.length > 0
            ? <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8 font-marcellus">
              {orders.map((item, index) => (
                <div
                  key={item._id}
                  className="bg-white border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300"
                >
                  <div className="relative w-full pb-[100%]">
                    <img
                      src={item.products[0].photo}
                      alt='Main Image'
                      className="absolute inset-0 w-full h-full object-cover bg-gray-200"
                    />
                  </div>
                  <div className="p-4">
                    <div className="w-full h-auto flex justify-between items-center">
                      <span className="font-bold">{item.client.name}</span>
                      <span className="font-bold">{item.client.phone}</span>
                    </div>
                    <div className="w-full h-auto flex justify-between items-center mt-3">
                      <span className="font-bold">Products: {item.products.length}</span>
                      <span className="font-bold">{item.orderStatus}</span>
                    </div>
                    <p className="mt-3">{item.paymentStatus}</p>
                    <div className="flex justify-between mt-6 gap-2">
                      <button onClick={() => handleView(orders[index])} className="w-full h-auto flex justify-center items-center bg-blue-500 text-white font-semibold py-2 rounded-md md:hover:bg-blue-600 active:bg-blue-600">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            : <div className="w-full h-80 flex justify-center items-center text-3xl font-bold">
              No orders Available
            </div>
        }

      </div>

      {isOrderDetailsOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-[1200px] h-[80vh]  rounded-lg shadow-lg relative overflow-hidden">
            {/* Close Button */}
            <button
              onClick={handleOrderPopUpClose}
              className="absolute top-2 right-6 text-gray-500 hover:text-gray-700"
            >
              <AiOutlineCloseCircle size={40} />
            </button>

            {/* Scrollable Order Details */}
            <div className="h-full overflow-y-auto">
              <SingleOrder item={singleOrderDetails} />
            </div>
          </div>
        </div>
      )}

      {isOrderFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-[1200px] h-[80vh]  rounded-lg shadow-lg relative overflow-hidden">
            {/* Close Button */}
            <button
              onClick={closeOrderForm}
              className="absolute top-2 right-6 text-gray-500 hover:text-gray-700"
            >
              <AiOutlineCloseCircle size={40} />
            </button>

            {/* Scrollable Order Form */}
            <div className="h-full overflow-y-auto">
              <OrderForm />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StaffDashboard;
