import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { setConfigurationField } from "../../../../features/configuration/configurationSlice";
import HTMLRenderer from "../../../HTMLRenderer";
import SectionHeading from "../../../ui/SectionHeading";
import Selectable from "../../../ui/Selectable";
import { SkeletonGrid } from "../../../ui/Skeleton";
import Error from "../../../ui/Error";
import { RootState } from "../../../../app/store";
import useEquipmentSystems from "../../../../hooks/useEquipmentSystems";

const Systems = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { systems, isLoading, error } = useEquipmentSystems();

  const currentDoorSystem = useSelector(
    (state: RootState) => state.configuration["system-name"]
  );

  if (isLoading) return <SkeletonGrid />;
  if (error) return <Error message={t("error-occurred")} />;

  const handleSelectSystem = (name: string, id: number) => {
    dispatch(setConfigurationField({ field: "system-name", value: name }));
    dispatch(setConfigurationField({ field: "system-id", value: id }));
  };

  const shownSystems = systems?.filter((system) => system.is_shown) ?? [];

  return (
    <>
      <SectionHeading>{t("choose-door-system")}</SectionHeading>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {shownSystems.map((item) => (
          <Selectable
            key={item.id}
            isSelected={currentDoorSystem === item.name}
            onClick={() => handleSelectSystem(item.name, item.id)}
          >
            <img
              src={`${process.env.REACT_APP_API_URL}/storage/${item.thumbnail}`}
              alt={t(item.description || "")}
              className="h-24 w-full object-contain mb-3"
            />

            <h3 className="text-center text-base font-bold leading-snug">
              {t(item.name)}
            </h3>

            <div className="mt-1.5 text-xs text-center text-primary-grey leading-relaxed">
              {<HTMLRenderer htmlContent={t(item.description || "")} />}
            </div>
          </Selectable>
        ))}
      </div>
    </>
  );
};

export default Systems;
