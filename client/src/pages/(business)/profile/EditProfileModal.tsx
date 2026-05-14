import { useState, useRef, useEffect, ChangeEvent, FormEvent } from "react";
import useUpdateUserProfile from "@/hooks/useUpdateUserProfile";

import { User } from "@/types/User";

const EditProfileModal = ({ currentUser }: { currentUser: User }) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    bio: "",
    link: "",
    newPassword: "",
    currentPassword: "",
  });

  const { updateProfile, updatingProfile } = useUpdateUserProfile();

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (currentUser) {
      setFormData({
        fullName: currentUser.fullName,
        username: currentUser.username,
        email: currentUser.email,
        bio: currentUser.bio,
        link: currentUser.link,
        newPassword: "",
        currentPassword: "",
      });
    }
  }, [currentUser]);

  const openModal = () => {
    modalRef.current?.showModal();
  };

  const closeModal = () => {
    modalRef.current?.close();
  };
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateProfile(formData, {
      onSuccess: () => closeModal(),
    });
  };

  return (
    <>
      <button
        className="rounded-full btn btn-outline btn-sm"
        onClick={openModal}
      >
        Edit profile
      </button>
      <dialog ref={modalRef} className="modal">
        <div className="border border-gray-700 rounded-md shadow-md modal-box">
          <h3 className="my-3 text-lg font-bold">Update Profile</h3>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                placeholder="Full Name"
                className="flex-1 p-2 border border-gray-700 rounded input input-md"
                value={formData.fullName}
                name="fullName"
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Username"
                className="flex-1 p-2 border border-gray-700 rounded input input-md"
                value={formData.username}
                name="username"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 p-2 border border-gray-700 rounded input input-md"
                value={formData.email}
                name="email"
                onChange={handleInputChange}
              />
              <textarea
                placeholder="Bio"
                className="flex-1 p-2 border border-gray-700 rounded resize-none input input-md max-h-32"
                value={formData.bio}
                name="bio"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                type="password"
                placeholder="Current Password"
                className="flex-1 p-2 border border-gray-700 rounded input input-md"
                value={formData.currentPassword}
                name="currentPassword"
                onChange={handleInputChange}
              />
              <input
                type="password"
                placeholder="New Password"
                className="flex-1 p-2 border border-gray-700 rounded input input-md"
                value={formData.newPassword}
                name="newPassword"
                onChange={handleInputChange}
              />
            </div>
            <input
              type="text"
              placeholder="Link"
              className="flex-1 p-2 border border-gray-700 rounded input input-md"
              value={formData.link}
              name="link"
              onChange={handleInputChange}
            />
            <button className="text-white rounded-full btn btn-primary btn-sm">
              {updatingProfile ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop" onClick={closeModal}>
          <button className="outline-none">close</button>
        </form>
      </dialog>
    </>
  );
};

export default EditProfileModal;
