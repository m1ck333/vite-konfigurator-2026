import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { AppDispatch, RootState } from "../../../app/store";
import { loginUser } from "../../../features/user/userSlice";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import Modal from "../../ui/Modal";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialFormData = {
  username: "",
  password: "",
};

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const isLoading = useSelector((state: RootState) => state.user.isLoading);

  const [formData, setFormData] = useState(initialFormData);

  const handleClose = () => {
    setFormData(initialFormData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.password.trim()) {
      toast.error(t("auth-messages.enter-credentials"), {
        toastId: "login-validation",
      });
      return;
    }

    const resultAction = await dispatch(
      loginUser({
        username: formData.username,
        password: formData.password,
      })
    );

    if (loginUser.fulfilled.match(resultAction)) {
      toast.success(t("auth-messages.logged-in-successfully"), {
        toastId: "login-success",
      });

      handleClose();
    } else {
      const errorMessage =
        typeof resultAction.payload === "string"
          ? t(resultAction.payload)
          : t("auth-messages.an-unknown-error-occurred");

      toast.error(errorMessage, {
        toastId: "login-error",
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t("login")}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <Input
            type="text"
            onChange={handleChange}
            name="username"
            value={formData.username}
            label={t("username")}
            required
          />
          <Input
            type="password"
            onChange={handleChange}
            name="password"
            value={formData.password}
            label={t("password")}
            required
          />
        </div>

        <div className="flex justify-end w-full">
          <Button className="mt-8" type="submit" isLoading={isLoading}>
            {t("login")}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default LoginModal;
