import React from 'react';
import Header from "./Layout/header";
import Footer from './Layout/footer';

const CancelliationPolicy = () => {
  return (
    <>
    <Header/>
   
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md" style={{padding:"20px"}}>
      <h1 className="text-2xl font-bold mb-6 text-center md:text-3xl">Cancellation Policy</h1>
      
     
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4"><b>Cancellations &amp; Refunds</b></h2>
        <ul>
            <li>Platform fees are non-refundable once services are initiated.</li>
            <li>If a lawyer fails to respond in a reasonable time after payment, users may request rescheduling or reassignment.</li>
            <li>All refund decisions are at the sole discretion of Counvo.</li>
          </ul>
      </section>
      
 
    </div>
    <Footer/>
     </>
  );
};

export default CancelliationPolicy;
