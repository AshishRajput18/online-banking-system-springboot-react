import { Routes, Route } from "react-router-dom";
import NavbarComponent from "./components/NavbarComponent/NavbarComponent";
import HeroImage from "./components/HeroImage/HeroImage";
import WelcomeSection from "./components/WelcomeSection/WelcomeSection";
import ExperienceSection from "./components/ExperienceSection/ExperienceSection";
import FooterComponent from "./components/FooterComponent/FooterComponent";

// AUTH PAGES
import AdminRegister from "./components/pages/admin/AdminRegister";
import UserLogin from "./components/pages/user/UserLogin";

// ADMIN PAGES
import BankManagerRegister from "./components/pages/admin/BankManagerRegister";
import AllBankManagers from "./components/pages/admin/AllBankManagers";
import AddBank from "./components/pages/admin/AddBank";
import AllBanks from "./components/pages/admin/AllBanks";
import AllBankCustomers from "./components/pages/admin/AllBankCustomers";
import AllBankAccounts from "./components/pages/admin/AllBankAccounts";
import AllTransactions from "./components/pages/admin/AllTransactions";
import CustomerRegister from "./components/pages/bank/CustomerRegister";
import AllCustomers from "./components/pages/bank/AllCustomers";
import CustomerAccountTransactions from "./components/pages/bank/CustomerAccountTransactions";
import AddBankAccount from "./components/pages/bank/AddBankAccount";
import AccountDetail from "./components/pages/bank/AccountDetail";
import AllBankAccount from "./components/pages/bank/account/AllBankAccount";
import CustomerAccountTransaction from "./components/pages/user/CustomerAccountTransaction";

import About from "./components/About/About";
import Contact from "./components/Contact/Contact";
import TransferMoney from "./components/pages/user/TransferMoney";
import CustomerBankAccountDetail from "./components/pages/user/CustomerBankAccountDetail";


function App() {
  return (
    <>
      <NavbarComponent />

      <Routes>
        {/* 🏠 HOME PAGE */}
        <Route
          path="/"
          element={
            <>
              <HeroImage />
              <WelcomeSection />
              <ExperienceSection />
              <FooterComponent />
            </>
          }
        />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* 👤 AUTH PAGES */}
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/admin/register" element={<AdminRegister />} />

        {/* 👤 CUSTOMER (USER) PAGES */}
        <Route path="/customer/account/transfer" element={<TransferMoney/>} />
        <Route path="/customer/bank/account/detail" element={<CustomerBankAccountDetail />} />
         {/* CUSTOMER TRANSACTION STATEMENT */}
        <Route
          path="/customer/bank/account/statement"
          element={<CustomerAccountTransaction/>}
        />

        {/* 👤 BANK MANAGER (BANK) PAGES */}
        <Route path="/user/customer/register" element={<CustomerRegister/>} />
        <Route path="/bank/account/all" element={<AllBankAccount/>} />
        <Route path="/bank/customer/all" element={<AllCustomers/>} />
        <Route path="/bank/customer/account/add" element={<AddBankAccount />} />
        {/* CUSTOMER ACCOUNT DETAIL */}
        <Route
          path="/bank/account/customer/detail"
          element={<AccountDetail />}
        />
        <Route
          path="/customer/bank/account/statement"
          element={<CustomerAccountTransaction />}
        />
        
        <Route path="/bank/customer/account/transactions" element={<CustomerAccountTransactions />} />

        {/* 🛡️ ADMIN PAGES */}
        <Route path="/admin/bank/register" element={<BankManagerRegister />} />
        <Route path="/admin/bank/add" element={<AddBank />} />
        <Route path="/admin/bank/all" element={<AllBanks />} />
        <Route path="/admin/bank/managers" element={<AllBankManagers />} />
        <Route path="/admin/allbank/customers" element={<AllBankCustomers/>} />
        <Route path="/admin/bank/account/all" element={<AllBankAccounts />}/>
        <Route path="/admin/bank/transactions" element={<AllTransactions/>} />
        <Route
    path="/admin/bank/account/statement/:accountNo"
    element={<AllTransactions />}
  />
      </Routes>
    </>
  );
}

export default App;
