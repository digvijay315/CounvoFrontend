import React from 'react';
import Header from "./Layout/header";
import Footer from './Layout/footer';

const ShippingPolicy = () => {
  return (
    <>
    <Header/>
   
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md" style={{padding:"20px"}}>
      <h1 className="text-2xl font-bold mb-6 text-center md:text-3xl">Shipping & Service Delivery Policy</h1>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">No Physical Shipping</h2>
        <p className="text-gray-700">
          Counvo does not sell or deliver any physical products. Our platform is designed solely to connect clients with legal professionals for online consultations and services.
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Service Delivery</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Users select their requirements (case type, preferred court, and language).</li>
          <li>Based on these details, our platform connects the user to a suitable lawyer.</li>
          <li>The user and the lawyer then communicate directly on the platform to discuss and finalise the service and payment.</li>
          <li>Counvo does not control or guarantee the service terms or outcomes; we only facilitate the initial connection.</li>
          <li>Delivery is considered complete once the lawyer and client are connected through the platform.</li>
        </ul>
      </section>
      
      <section>
        <h2 className="text-xl font-semibold mb-4">Delivery Timelines</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Connection to a lawyer is generally provided immediately after the user submits their details.</li>
          <li>If no lawyer is available at that moment, the user will be notified and can try again later.</li>
        </ul>
      </section>
    </div>
    <Footer/>
     </>
  );
};

export default ShippingPolicy;
