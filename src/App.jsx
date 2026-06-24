import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import TourPage from "./pages/TourPage";
import LoginPage from "./pages/LoginPage";
import AccountPage from "./pages/AccountPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import WriteReviewPage from "./pages/WriteReviewPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/tour/:slug" element={<TourPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/me" element={<AccountPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
      <Route path="/resetPassword/:token" element={<ResetPasswordPage />} />
      <Route path="/my-bookings" element={<MyBookingsPage />}/>
      <Route path="/write-review/:tourId" element={<WriteReviewPage />}/>
      <Route path="/verify-email/:token" element={<VerifyEmailPage />}/>
    </Routes>
  );
}

export default App;