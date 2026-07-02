import { useTranslation } from "react-i18next";
import xMark from "../../../assets/images/x-mark.png";

type RemoveItemProps = {
  isShowed: boolean;
  onClick: () => void;
};

const RemoveItem = ({ isShowed, onClick }: RemoveItemProps) => {
  const { t } = useTranslation();

  return (
    <>
      {isShowed && (
        <div
          onClick={() => onClick()}
          className="flex justify-center items-center gap-2 cursor-pointer text-xs text-primary-grey-dark hover:text-danger transition-colors w-fit"
        >
          <img className="h-3" src={xMark} alt="Remove" />
          <p className="text-center">{t("remove")}</p>
        </div>
      )}
    </>
  );
};

export default RemoveItem;
