import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#f5f7f5] px-0 pt-12 pb-0 text-sm mt-16">
      <div className="flex flex-col md:flex-row justify-between max-w-6xl mx-auto px-16">
        <div className="mb-8 md:mb-0">
          <div className="flex items-center space-x-2 mb-2">
            <img src="/logo.png" alt="PetHealthy Logo" className="h-8" />
            <span className="font-bold text-[#7bb12b] text-2xl">PETHEALTHY</span>
          </div>
          <p className="text-gray-600 mt-2 max-w-xs">
            Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.
          </p>
          <div className="flex items-center mt-4 gap-2">
            <img src="/hotline-icon.png" alt="" className="h-6" />
            <span className="text-[#1797a6] font-bold">(+990) 123456789</span>
          </div>
          <div className="w-20 h-20 bg-gray-400 rounded mt-8" />
        </div>
        <div className="flex space-x-16 mt-6 md:mt-0">
          <div>
            <h4 className="font-bold mb-2">Link</h4>
            <ul className="space-y-1">
              <li>About Us</li>
              <li>Pricing Plan</li>
              <li>Blogs</li>
              <li>Shop</li>
              <li>Gellary</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-2">Legal</h4>
            <ul className="space-y-1">
              <li>Privacy Policy</li>
              <li>Terms of use</li>
              <li>Trems & conditions</li>
              <li>My Account</li>
              <li>Order List</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-2">Contact Us</h4>
            <ul className="space-y-1">
              <li>Bellbron Road, New York</li>
              <li>Cell : 99001654789532</li>
              <li>E-mail : petology.us@gmail.com</li>
              <li className="flex space-x-2 mt-2">
                <img src="/facebook-icon.png" alt="Facebook" className="h-4" />
                <img src="/twitter-icon.png" alt="Twitter" className="h-4" />
                <img src="/linkedin-icon.png" alt="LinkedIn" className="h-4" />
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-[#1797a6] text-white text-xs py-3 mt-12 flex justify-between px-16">
        <span>Copyright © 2022 Petology All Rights Reserved.</span>
        <span>
          Privacy & Terms
          <span className="mx-2">|</span>
          FAQ
        </span>
      </div>
    </footer>
  );
}