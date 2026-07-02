import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { useLocks } from "../../../../hooks/useLocks";
import { SkeletonGrid } from "../../../ui/Skeleton";
import Error from "../../../ui/Error";
import Selectable from "../../../ui/Selectable";
import { RootState } from "../../../../app/store";
import { setEquipmentSelection } from "../../../../features/configuration/configurationSlice";
import SectionHeading from "../../../ui/SectionHeading";

const Lock = () => {
  const { t, i18n } = useTranslation();
  const { locks, isLoading, isError } = useLocks();

  const dispatch = useDispatch();

  const currentDoorLock = useSelector(
    (state: RootState) => state.configuration.equipment.lock.id
  );

  if (isLoading) return <SkeletonGrid />;
  if (isError) return <Error message={t("error-occurred")} />;

  if (!locks || locks.length === 0) {
    return <Error message={t("locks-not-found")} />;
  }

  const handleSelectLock = (id: number, name: string) => {
    dispatch(
      setEquipmentSelection({
        category: "lock",
        selection: { id },
      })
    );
  };

  return (
    <>
      <SectionHeading>{t("choose-door-lock")}</SectionHeading>

      <div className="grid grid-cols-2 md:grid-cols-2 gap-2 pt-2">
        {locks
          .filter((lock) => lock.is_shown)
          .map((lock) => (
            <Selectable
              key={lock.id}
              isSelected={currentDoorLock === lock.id}
              onClick={() => handleSelectLock(lock.id, lock.code)}
            >
              <img
                src={`${process.env.REACT_APP_API_URL}/storage/${lock.thumbnail}`}
                alt={lock.code}
                className="max-w-full h-auto"
              />

              <span className="mt-2 text-center">{lock.code}</span>
              <span className="text-sm text-center">
                {lock.translations.find((t) => t.language === i18n.language)
                  ?.name || t("no-description")}
              </span>
            </Selectable>
          ))}
      </div>
    </>
  );
};

export default Lock;
