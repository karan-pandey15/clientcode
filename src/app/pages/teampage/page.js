import React from 'react'

import ceo_photo from "../../../../public/founderimg.jpg";
import Link from 'next/link';
import Image from "next/image";
import Navbar from '@/app/components/navbar/page';
import Footer from '@/app/components/footer/page';
function TeamPage() {
  return (
    <div>
        <Navbar />
        <section>
          <div className="container py-5"> 
            <p> 
            <span style={{fontWeight:"bold"}}> I'm Mamta Rewar, </span> the captain steering the ship at AddRupee. With an MBA and extensive <span style={{fontWeight:"500"}} >15 Years</span> experience in the financial sector, I lead our team with a vision for success. My goal is to ensure that AddRupee not only meets but exceeds your expectations. Under my leadership, we strive to create a positive impact on your financial well-being.

 <h3 className='mt-3'  >Our Vision</h3>
At AddRupee, our vision is to be the leading provider of financial solutions that empower individuals and businesses to achieve their financial dreams. We believe in building long-term relationships with our clients, based on trust, integrity, and mutual respect. Our team is committed to continuous learning and improvement, ensuring that we stay ahead of industry trends and provide you with the best advice and services.
 
<h3 className='mt-3' >Our Services</h3>
We offer a wide range of financial services, including:

<p className='mt-3' >Personal Loans</p>
<p>Car Loans</p>
<p>Business Loans</p>
<p>Home Loans</p>
<p>Education Loans</p>
<p>Debt Consolidation Loans</p>
<p>Medical Loans</p>
<p>Travel Loans</p>

<h3 className='mt-3' >Why Choose Us? </h3>
Choosing AddRupee means choosing a partner who is as invested in your financial success as you are. Our team of dedicated professionals works diligently to provide you with innovative solutions and exceptional service. We take pride in our client-centric approach, where your needs and goals are our top priority.

<h3 className='mt-3' >Contact Us</h3>
Ready to take the next step towards achieving your financial goals? Contact us today to learn more about how AddRupee can help you succeed. We look forward to partnering with you on your financial journey.
<p  className='text-center mt-5 text-success' >
Thank you for considering AddRupee. Together, we can make your financial dreams a reality.</p>
            </p>
            <div className="row">
              <div className="col-12 col-md-6 col-lg-4">
                <div className="card my-3" style={{ width: "100%" }}>
                  <Image
                    className="card-img-top img-fluid rounded-start"
                    src={ceo_photo}
                    alt="..."
                  />
                  <div className="card-body text-dark">
                    <h5 className="card-title ">Mamta Rewar</h5>
                    <p className="card-text ">
                      I'm Mamta Rewar, an MBA graduate, and I'm like the
                      captain of a company called Addrupee, steering it towards
                      success.
                    </p> 
                  </div>
                </div>
              </div> 
            </div>
          </div>
        </section>
        <Footer />
    </div>
  )
}

export default TeamPage