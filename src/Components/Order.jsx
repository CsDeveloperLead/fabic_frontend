import { useState, useEffect } from "react";
import axios from "axios";

const backend = import.meta.env.VITE_BACKEND_URL;

const OrderForm = () => {
  const [client, setClient] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [products, setProducts] = useState([]);
  const [receivingDate, setReceivingDate] = useState("");
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("");
  const [paymentGiven, setPaymentGiven] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState("Not Paid");
  const [orderStatus, setOrderStatus] = useState("In Process");
  const [orderIssue, setOrderIssue] = useState("");
  const [orderIssueToggle, setOrderIssueToggle] = useState(false);

  // Calculate total service cost
  const totalCost = products.reduce((total, product) => total + product.serviceCost, 0);

  // Update payment status based on payment given vs total cost
  useEffect(() => {
    if (paymentGiven === 0) {
      setPaymentStatus("Not Paid");
    } else if (paymentGiven < totalCost) {
      setPaymentStatus("Partially Paid");
    } else if (paymentGiven >= totalCost) {
      setPaymentStatus("Full Paid");
    }
  }, [paymentGiven, totalCost]);

  const handleAddProduct = () => {
    setProducts([
      ...products,
      {
        type: "",
        productId: generateProductId(""),
        name: "",
        serviceCost: 0,
        status: "In Process",
        photo: null,
        serviceType: "",
        issue: "",
        isIssueVisible: false,
      },
    ]);
  };

  const handleDeleteProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  const handleProductChange = (index, key, value) => {
    const updatedProducts = [...products];

    // Update the key with the new value
    updatedProducts[index][key] = value;

    // If the key is 'name', generate and update the productId
    if (key === "name") {
      updatedProducts[index].productId = generateProductId(value);
    }

    setProducts(updatedProducts);
  };

  // Function to generate the product ID
  const generateProductId = (name) => {
    const prefix = name.substring(0, 2).toUpperCase(); // First two letters of the name
    const uniqueNumber = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit number
    return prefix + uniqueNumber;
  };


  const handleFileChange = (index, file) => {
    const updatedProducts = [...products];
    updatedProducts[index].photo = file;
    setProducts(updatedProducts);
  };

  const handleOrderStatusChange = (status) => {
    setOrderStatus(status);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(products);


    const formData = new FormData();

    // Append data
    formData.append("client", JSON.stringify(client));
    formData.append(
      "products",
      JSON.stringify(products.map((p) => ({ ...p, photo: undefined, isIssueVisible: undefined, issue: p.isIssueVisible && p.issue ? p.issue : undefined, })))
    );
    formData.append("receivingDate", receivingDate);
    formData.append("expectedDeliveryDate", expectedDeliveryDate);
    formData.append("paymentGiven", paymentGiven);
    formData.append("paymentStatus", paymentStatus);
    formData.append("orderStatus", orderStatus);
    formData.append("orderIssue", orderIssue);

    // Append files
    products.forEach((product, index) => {
      if (product.photo) {
        formData.append(`productPhotos[${index}]`, product.photo);
      }
    });

    try {
      await axios.post(
        `${backend}/api/v1/orders/create`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("Order created successfully!");
      setClient({
        name: "",
        email: "",
        phone: "",
        address: ""
      })

      setProducts([])
      setReceivingDate('')
      setExpectedDeliveryDate('')
      setPaymentGiven(0)
      setPaymentStatus("Not Paid")
      setOrderStatus("In Process")
      setOrderIssue('')
      setOrderIssueToggle(false)
    } catch (error) {
      console.error("Error creating order:", error.response || error.message);
      alert("Error creating order.");
    }
  };

  const toggleIssueVisibility = (index) => {
    const updatedProducts = [...products];
    updatedProducts[index].isIssueVisible = !updatedProducts[index].isIssueVisible;
    setProducts(updatedProducts);
  };

  // Update the issue for a product
  const handleIssueChange = (index, issue) => {
    const updatedProducts = [...products];
    updatedProducts[index].issue = issue;
    setProducts(updatedProducts);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col p-10 items-center">
      <h2 className="text-3xl font-bold mb-6">ORDER CREATION</h2>
      <div className="w-full flex justify-between gap-2 sm:gap-10 mb-4">
        <div className="w-1/2">
          <label className="text-sm font-medium text-gray-700 mb-2">Name:</label>
          <input
            type="text"
            value={client.name}
            onChange={(e) => setClient({ ...client, name: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 outline-none"
            placeholder="Enter client name"
          />
        </div>

        <div className="w-1/2">
          <label className=" text-sm font-medium text-gray-700 mb-2">Email:</label>
          <input
            type="email"
            value={client.email}
            onChange={(e) => setClient({ ...client, email: e.target.value })}
            required
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
            value={client.phone}
            onChange={(e) => setClient({ ...client, phone: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 outline-none"
            placeholder="Enter phone number"
          />
        </div>

        <div className="w-1/2">
          <label className="text-sm font-medium text-gray-700 mb-2">Address:</label>
          <input
            type="text"
            value={client.address}
            onChange={(e) => setClient({ ...client, address: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 outline-none"
            placeholder="Enter address"
          />
        </div>
      </div>

      <div className="w-full">
        <h3 className="text-2xl font-bold my-4">PRODUCTS</h3>
        {products.map((product, index) => (
          <div key={index} className="w-full space-y-4 mb-4">
            {/* Product Name, Type & Service Type */}
            <div className="w-full grid grid-cols-2 gap-2 md:grid-cols-3 sm:gap-10">
              <div className="">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name:
                </label>
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) =>
                    handleProductChange(index, "name", e.target.value)
                  }
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
                  onChange={(e) =>
                    handleProductChange(index, "type", e.target.value)
                  }
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
                  onChange={(e) =>
                    handleProductChange(index, "serviceType", e.target.value)
                  }
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
                  onChange={(e) =>
                    handleProductChange(index, "serviceCost", parseFloat(e.target.value))
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 outline-none"
                  placeholder="Enter service cost"
                />
              </div>
              <div className="w-full sm:w-1/2">
                <label className=" text-sm font-medium text-gray-700 mb-2">
                  Photo:
                </label>
                <div className="flex gap-2 sm:gap-10">
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(index, e.target.files[0])}
                    className="w-1/2 px-4 py-1.5 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 outline-none bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteProduct(index)}
                    className="px-4 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Delete Product
                  </button>
                </div>
              </div>
            </div>

            {/* raise a issue btn */}
            <div className="w-full flex flex-col gap-2">
              {product.isIssueVisible ? (
                <div>
                  <textarea
                    value={product.issue}
                    onChange={(e) => handleIssueChange(index, e.target.value)}
                    placeholder="Describe the issue"
                    rows="3"
                    className="w-full p-2 border border-gray-300 rounded-lg resize-none"
                  />
                  <button
                    type="button"
                    onClick={() => toggleIssueVisibility(index)}
                    className="mt-2 text-red-500"
                  >
                    Delete Issue
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => toggleIssueVisibility(index)}
                  className="mt-2 text-blue-500"
                >
                  Raise an Issue
                </button>
              )}
            </div>

            <div className="w-full h-auto flex flex-col"></div>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddProduct}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg mt-0"
        >
          Add Product
        </button>
      </div>

      {/* Receiving Date and Expected Delivery Date */}
      <div className="w-full flex flex-col sm:flex-row justify-between gap-2 sm:gap-10 mt-4">
        <div className="w-full sm:w-1/2">
          <label className="text-sm font-medium text-gray-700 mb-2">Receiving Date:</label>
          <input
            type="date"
            value={receivingDate}
            onChange={(e) => setReceivingDate(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 outline-none"
          />
        </div>

        <div className="w-full sm:w-1/2">
          <label className="text-sm font-medium text-gray-700 mb-2">
            Expected Delivery Date:
          </label>
          <input
            type="date"
            value={expectedDeliveryDate}
            onChange={(e) => setExpectedDeliveryDate(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 outline-none"
          />
        </div>
      </div>

      {/* Payment Information */}
      <div className="w-full mt-4">
        <label className="text-sm font-medium text-gray-700 mb-2">Payment Given:</label>
        <input
          type="number"
          value={paymentGiven}
          onChange={(e) => setPaymentGiven(parseFloat(e.target.value))}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 outline-none"
          placeholder="Enter payment given"
        />
        <p className="mt-2 text-sm text-gray-600">
          Total Cost: ₹{totalCost.toFixed(2)}
        </p>
        <p className="mt-1 text-sm text-gray-600">Payment Status: {paymentStatus}</p>
      </div>

      {/* Order Status */}
      <div className="w-full mt-4">
        <label className="text-sm font-medium text-gray-700 mb-2">Order Status:</label>
        <select
          value={orderStatus}
          onChange={(e) => handleOrderStatusChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 outline-none"
        >
          <option value="In Process">In Process</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      {/* Order Issue */}
      <div className="w-full flex flex-col gap-2 mt-4">
        {orderIssueToggle ? (
          <div>
            <textarea
              value={orderIssue}
              onChange={(e) => setOrderIssue(e.target.value)}
              placeholder="Describe the issue"
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-lg resize-none"
            />
            <button
              type="button"
              onClick={() => setOrderIssueToggle(false)}
              className="mt-2 text-red-500"
            >
              Delete Issue
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setOrderIssueToggle(true)}
            className="mt-2 text-blue-500"
          >
            Raise an Issue
          </button>
        )}
      </div>


      <button
        type="submit"
        className="px-4 py-2 bg-green-500 text-white rounded-lg mt-6"
      >
        Submit Order
      </button>
    </form>
  );
};

export default OrderForm;
