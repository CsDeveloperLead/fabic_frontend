import React, { useState } from 'react';
import axios from 'axios';

const OrderForm = () => {
  const [client, setClient] = useState({ name: '', email: '', phone: '', address: '' });
  const [products, setProducts] = useState([]);
  const [receivingDate, setReceivingDate] = useState('');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
  const [paymentGiven, setPaymentGiven] = useState(0);

  const handleAddProduct = () => {
    setProducts([...products, { type: '', productId: '', name: '', serviceCost: 0, status: 'In Process', photo: null }]);
  };

  const handleProductChange = (index, key, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][key] = value;
    setProducts(updatedProducts);
  };

  const handleFileChange = (index, file) => {
    const updatedProducts = [...products];
    updatedProducts[index].photo = file;
    setProducts(updatedProducts);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('client', JSON.stringify(client));
    formData.append('products', JSON.stringify(products.map(p => ({ ...p, photo: undefined }))));
    formData.append('receivingDate', receivingDate);
    formData.append('expectedDeliveryDate', expectedDeliveryDate);
    formData.append('paymentGiven', paymentGiven);

    products.forEach(product => {
      if (product.photo) formData.append('photos', product.photo);
    });

    try {
      const { data } = await axios.post('http://localhost:5000/api/orders/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Order created successfully!');
      console.log(data);
    } catch (error) {
      console.error(error);
      alert('Error creating order.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Place Order</h2>
      <div>
        <label>Client Name:</label>
        <input type="text" value={client.name} onChange={(e) => setClient({ ...client, name: e.target.value })} required />
        <label>Email:</label>
        <input type="email" value={client.email} onChange={(e) => setClient({ ...client, email: e.target.value })} required />
        <label>Phone:</label>
        <input type="text" value={client.phone} onChange={(e) => setClient({ ...client, phone: e.target.value })} required />
        <label>Address:</label>
        <input type="text" value={client.address} onChange={(e) => setClient({ ...client, address: e.target.value })} required />
      </div>
      <div>
        <h3>Products</h3>
        {products.map((product, index) => (
          <div key={index}>
            <label>Type:</label>
            <input type="text" value={product.type} onChange={(e) => handleProductChange(index, 'type', e.target.value)} required />
            <label>Product ID:</label>
            <input type="text" value={product.productId} onChange={(e) => handleProductChange(index, 'productId', e.target.value)} required />
            <label>Name:</label>
            <input type="text" value={product.name} onChange={(e) => handleProductChange(index, 'name', e.target.value)} required />
            <label>Service Cost:</label>
            <input type="number" value={product.serviceCost} onChange={(e) => handleProductChange(index, 'serviceCost', e.target.value)} required />
            <label>Photo:</label>
            <input type="file" onChange={(e) => handleFileChange(index, e.target.files[0])} />
          </div>
        ))}
        <button type="button" onClick={handleAddProduct}>Add Product</button>
      </div>
      <div>
        <label>Receiving Date:</label>
        <input type="date" value={receivingDate} onChange={(e) => setReceivingDate(e.target.value)} required />
        <label>Expected Delivery Date:</label>
        <input type="date" value={expectedDeliveryDate} onChange={(e) => setExpectedDeliveryDate(e.target.value)} required />
        <label>Payment Given:</label>
        <input type="number" value={paymentGiven} onChange={(e) => setPaymentGiven(e.target.value)} required />
      </div>
      <button type="submit">Create Order</button>
    </form>
  );
};

export default OrderForm;
