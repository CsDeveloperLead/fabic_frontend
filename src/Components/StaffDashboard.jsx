import { useState } from "react";
import AddNewButton from "./Button";
import OrderForm from "./Order";
import { AiOutlineCloseCircle } from "react-icons/ai";

const StaffDashboard = () => {
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);

  const openOrderForm = () => {
    setIsOrderFormOpen(true);
  };

  const closeOrderForm = () => {
    setIsOrderFormOpen(false);
  };

  return (
    <div className="mx-10 mt-10 flex flex-col items-center">
      <h1 className="text-4xl font-bold my-10">Staff Dashboard</h1>
      <div className="w-full shadow-md h-[150px] rounded-3xl flex justify-center items-center p-4 border drop-shadow-md border-gray-400">
        <div className="flex flex-col items-center">
          <AddNewButton onClick={openOrderForm} />
          <span className="px-6 mt-4 text-3xl font-bold">Create New Order</span>
        </div>
      </div>

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
