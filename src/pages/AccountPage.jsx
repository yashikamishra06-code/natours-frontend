import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { getMe, updateSettings } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { userImageUrl } from "../utils/imageUrl";

function AccountPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPhoto, setCurrentPhoto] = useState("default.jpg");
  const [photo, setPhoto] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);

  const [message, setMessage] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const user = await getMe();

        setName(user.name);
        setEmail(user.email);
        setCurrentPhoto(user.photo || "default.jpg");
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    }

    loadUser();
  }, [navigate]);

  function handlePhotoChange(e) {
    const file = e.target.files[0];

    if (!file) return;

    setPhoto(file);
    setPreviewPhoto(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("email", email);

      if (photo) {
        formData.append("photo", photo);
      }

      await updateSettings(formData, "data");

      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Error updating profile");
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();

    try {
      setPasswordLoading(true);

      await updateSettings(
        {
          currPass: currentPassword,
          newPass: newPassword,
          newPassConfirm: confirmPassword,
        },
        "password"
      );

      setPasswordMessage("Password updated successfully!");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setPasswordMessage("Error updating password");
    } finally {
      setPasswordLoading(false);
    }
  }

  return (
    <Layout>
      <section className="mx-auto max-w-4xl px-10 py-16 text-white">
        <h1 className="mb-10 text-5xl font-bold text-green-400">
          Your Account
        </h1>

        <form onSubmit={handleSubmit} className="rounded-2xl bg-slate-900 p-8">
          <div className="mb-8 flex flex-col items-center">
            <img
              src={previewPhoto || userImageUrl(currentPhoto)}
              alt={name}
              className="mb-4 h-32 w-32 rounded-full object-cover ring-4 ring-green-400"
            />

            <label className="cursor-pointer rounded-full bg-slate-800 px-5 py-2 font-semibold hover:bg-slate-700">
              Change Photo
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="mb-6">
            <label className="mb-2 block font-semibold">Name</label>

            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg bg-slate-800 p-3 outline-none"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block font-semibold">Email</label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg bg-slate-800 p-3 outline-none"
            />
          </div>

          {message && <p className="mb-4 text-green-400">{message}</p>}

          <button
            type="submit"
            className="rounded-full bg-green-500 px-6 py-3 font-semibold"
          >
            Save Settings
          </button>
        </form>

        <div className="mt-10 rounded-2xl bg-slate-900 p-8">
          <h2 className="mb-6 text-3xl font-bold text-green-400">
            Change Password
          </h2>

          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-6">
              <label className="mb-2 block font-semibold">
                Current Password
              </label>

              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-lg bg-slate-800 p-3 outline-none"
              />
            </div>

            <div className="mb-6">
              <label className="mb-2 block font-semibold">New Password</label>

              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-lg bg-slate-800 p-3 outline-none"
              />
            </div>

            <div className="mb-6">
              <label className="mb-2 block font-semibold">
                Confirm Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg bg-slate-800 p-3 outline-none"
              />
            </div>

            {passwordMessage && (
              <p className="mb-4 text-green-400">{passwordMessage}</p>
            )}

            <button
              type="submit"
              className="rounded-full bg-green-500 px-6 py-3 font-semibold"
            >
              {passwordLoading ? "Updating..." : "Save Password"}
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
}

export default AccountPage;