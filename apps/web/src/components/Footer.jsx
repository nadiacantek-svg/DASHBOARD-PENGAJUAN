import React from 'react';

const Footer = () => {
  return (
    <>
      <footer className="bg-surface-container-low w-full py-lg px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-md font-label-md text-label-md text-secondary">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center gap-lg justify-between relative">
          <div className="text-xs opacity-70">©2026 Universitas Negeri Malang</div>
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZCxwfszeayUrKZiJwdNq776QxLNQMGhJTeytNC_RKTImh8t0as4qvvM8q6AA-GrGfrHelKclIP4P-wSWHImBBSxmOy6fO0rBq89v1_k8PVe7ESC2FcJqwMv9ulgxVK1cVc267kW9nLj11KTLGB_XKt1grdGccSMFvmpC-IKNLpEOwufrh0L7QTQsfxVQEEBXPv36j14q248FvTUcV6Cpkx9BdMu7z6lIKoxaPlqjQCdvE9vS4wdJ1aBXPIvB2H8mCAffiU2wEIA" alt="Logo Universitas Negeri Malang" className="h-20 w-auto opacity-70 absolute left-1/2 -translate-x-1/2" />
          <div className="flex gap-md text-xs opacity-70">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Accessibility</a>
            <a href="#" className="hover:text-primary transition-colors">Support</a>
          </div>
        </div>
      </footer>
      <div className="w-full h-8 bg-[#7c3aed]"></div>
    </>
  );
};

export default Footer;
