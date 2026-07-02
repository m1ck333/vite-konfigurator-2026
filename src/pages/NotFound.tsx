import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

const NotFound: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary-light">
      <div className="text-center">
        <h1 className="text-7xl font-bold text-primary-green">404</h1>
        <p className="text-2xl text-primary-grey-dark mt-4">
          {t("page-not-found")}
        </p>
        <p className="mt-2 mb-6 text-primary-grey">
          {t("the-page-does-not-exist")}
        </p>

        <Link to="/">
          <Button>{t("go-back-home")}</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
