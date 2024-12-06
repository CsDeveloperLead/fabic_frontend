import React, { useState } from 'react'
import axios from 'axios';

const backend = import.meta.env.VITE_BACKEND_URL;

function SingleOrder({ item }) {
    const [orderIssue, setOrderIssue] = useState(item.orderIssue || ''); // State for order issue
    const [productIssues, setProductIssues] = useState(item.products.map(p => p.issue || '')); // State for product issues
    const [orderStatus, setOrderStatus] = useState(item.orderStatus || ''); // State for order status

    // Handle product issue change
    const handleProductIssueChange = (index, value) => {
        const updatedProductIssues = [...productIssues];
        updatedProductIssues[index] = value;
        setProductIssues(updatedProductIssues);
    };

    const handleViewImage = (imageUrl) => {
        window.open(imageUrl, '_blank');
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare updated data
        const updatedData = {
            orderId: item._id,  // Assuming `item._id` is the order ID
            orderIssue,
            orderStatus,
            products: item.products.map((product, index) => ({
                ...product,
                issue: productIssues[index] || product.issue, // Update product issue if changed
            }))
        };

        // try {
        //     const response = await axios.post(`${backend}/api/v1/orders/update-order`, updatedData);
        //     alert("Order updated successfully!");
        // } catch (error) {
        //     console.error("Error updating order:", error);
        //     alert("Error updating order.");
        // }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full flex flex-col p-10 items-center">
            <h2 className="text-3xl font-bold mb-6">ORDER Details</h2>
            <div className="w-full flex justify-between gap-2 sm:gap-10 mb-4">
                <div className="w-1/2">
                    <label className="text-sm font-medium text-gray-700 mb-2">Name:</label>
                    <input
                        type="text"
                        value={item.client.name}
                        required
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 outline-none"
                        placeholder="Enter client name"
                    />
                </div>

                <div className="w-1/2">
                    <label className=" text-sm font-medium text-gray-700 mb-2">Email:</label>
                    <input
                        type="email"
                        value={item.client.email}
                        required
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 outline-none"
                        placeholder="Enter email address"
                    />
                </div>
            </div>

            <div className="w-full flex justify-between gap-2 sm:gap-10">
                <div className="w-1/2">
                    <label className="text-sm font-medium text-gray-700 mb-2">Phone:</label>
                    <input
                        type="text"
                        value={item.client.phone}
                        required
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 outline-none"
                        placeholder="Enter phone number"
                    />
                </div>

                <div className="w-1/2">
                    <label className="text-sm font-medium text-gray-700 mb-2">Address:</label>
                    <input
                        type="text"
                        value={item.client.address}
                        required
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 outline-none"
                        placeholder="Enter address"
                    />
                </div>
            </div>

            <div className="w-full">
                <h3 className="text-2xl font-bold my-4">PRODUCTS</h3>
                {item.products.map((product, index) => (
                    <div key={index} className="w-full space-y-4 mb-4">
                        <h1 className='text-xl font-bold'>Product : {index + 1}</h1>
                        {/* Product Name, Type & Service Type */}
                        <div className="w-full grid grid-cols-2 gap-2 md:grid-cols-3 sm:gap-10">
                            <div className="">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product Name:
                                </label>
                                <input
                                    type="text"
                                    value={product.name}
                                    disabled
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 outline-none"
                                    placeholder="Enter product name"
                                />
                            </div>
                            <div className="">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product Type:
                                </label>
                                <select
                                    value={product.type}
                                    disabled
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 outline-none bg-white"
                                >
                                    <option value="" disabled>Select product type</option>
                                    <option value="Type 1">Type 1</option>
                                    <option value="Type 2">Type 2</option>
                                    <option value="Type 3">Type 3</option>
                                    <option value="Type 4">Type 4</option>
                                    <option value="Type 5">Type 5</option>
                                </select>
                            </div>
                            <div className="">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Services Type:
                                </label>
                                <select
                                    value={product.serviceType}
                                    disabled
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 outline-none bg-white"
                                >
                                    <option value="" disabled>Select Services type</option>
                                    <option value="Laundry">Laundry</option>
                                    <option value="Washing">Washing</option>
                                    <option value="Dry Cleaning">Dry Cleaning</option>
                                    <option value="Ironing">Ironing</option>
                                </select>
                            </div>
                        </div>

                        {/* Service Cost & Photo */}
                        <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-10">
                            <div className="w-full sm:w-1/2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Service Cost:
                                </label>
                                <input
                                    type="number"
                                    value={product.serviceCost}
                                    disabled
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 outline-none"
                                    placeholder="Enter service cost"
                                />
                            </div>
                            <div className="w-full sm:w-1/2">
                                <label className=" text-sm font-medium text-gray-700 mb-2">
                                    Photo:
                                </label>
                                <p onClick={() => handleViewImage(product.photo)} className='text-blue-500 mt-2 underline cursor-pointer'>View</p>
                            </div>
                        </div>

                        {
                            product.issue
                                ? <div className="w-full flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-700 mb-2">Product Issue:</label>
                                    <textarea
                                        value={productIssues[index]}
                                        onChange={(e) => handleProductIssueChange(index, e.target.value)}
                                        placeholder="Describe the issue"
                                        rows="3"
                                        className="w-full p-2 border border-gray-300 mt-2 rounded-lg resize-none"
                                    />
                                </div>
                                : null
                        }
                        <div className="w-full h-auto flex flex-col"></div>
                    </div>
                ))}
            </div>


            {/* Receiving Date and Expected Delivery Date */}
            <div className="w-full flex flex-col sm:flex-row justify-between gap-2 sm:gap-10 mt-4">
                <div className="w-full sm:w-1/2">
                    <label className="text-sm font-medium text-gray-700 mb-2">Receiving Date:</label>
                    <input
                        type="date"
                        value={item.receivingDate ? item.receivingDate.split('T')[0] : ''}
                        disabled
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                    />
                </div>

                <div className="w-full sm:w-1/2">
                    <label className="text-sm font-medium text-gray-700 mb-2">
                        Expected Delivery Date:
                    </label>
                    <input
                        type="date"
                        value={item.expectedDeliveryDate ? item.expectedDeliveryDate.split('T')[0] : ''}
                        disabled
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                    />
                </div>
            </div>

            {/* Payment Information */}
            <div className="w-full mt-4">
                <label className="text-sm font-medium text-gray-700 mb-2">Payment Given:</label>
                <input
                    type="number"
                    value={item.paymentGiven}
                    required
                    disabled
                    className="w-full px-4 py-2 border mt-2 border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 outline-none"
                    placeholder="Enter payment given"
                />
                <p className="mt-2 text-sm text-gray-600">
                    {/* Total Cost: ₹{totalCost.toFixed(2)} */}
                </p>
                <p className="mt-1 text-sm text-gray-600">Payment Status: {item.paymentStatus}</p>
            </div>

            {/* Order Status */}
            <div className="w-full mt-4">
                <label className="text-sm font-medium text-gray-700 mb-2">Order Status:</label>
                <select
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                >
                    <option value="In Process">In Process</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                </select>
            </div>

            {/* Order Issue */}
            <div className="w-full flex flex-col gap-2 mt-4">
                <label className="text-sm font-medium text-gray-700 mb-2">Order Issue:</label>
                <textarea
                    value={orderIssue}
                    onChange={(e) => setOrderIssue(e.target.value)}
                    placeholder="Describe the issue"
                    rows="3"
                    className="w-full p-2 border border-gray-300 mt-2 rounded-lg resize-none"
                />
            </div>

            {/* Submit Button */}
            <div className="w-full mt-6 flex justify-center">
                <button type="submit" className="px-4 py-2 bg-teal-500 text-white rounded-lg">
                    Update Order
                </button>
            </div>
        </form>
    )
}

export default SingleOrder