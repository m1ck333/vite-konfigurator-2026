import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { SkeletonGrid } from "../../../ui/Skeleton";
import Error from "../../../ui/Error";
import Select from "../../../ui/Select";
import { useDoors } from "../../../../hooks/useDoors";
import { Door } from "../../../../types";
import { setConfigurationField } from "../../../../features/configuration/configurationSlice";
import { RootState } from "../../../../app/store";
import { store } from "../../../../app/store";
import Selectable from "../../../ui/Selectable";
import { setActiveDropDownItem } from "../../../../features/sidebar/sidebarSlice";
import SectionHeading from "../../../ui/SectionHeading";

const DoorModel = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const selectedDropDownItem = useSelector(
    (state: RootState) => state.sidebar.activeDropDownItem.model
  );

  const selectedModel = useSelector(
    (state: RootState) => state.configuration["model-name"]
  );

  const isPanelColorDefault = useSelector(
    (state: RootState) => state.configuration["is-panel-color-default"]
  );

  const { doors, isLoading, isError } = useDoors(selectedDropDownItem);

  const selectOptions = [
    { value: "all", label: t("all-models") },
    { value: "with-glass", label: t("models-with-glass") },
    { value: "without-glass", label: t("models-without-glass") },
  ];

  const handleSelectDoorModel = (doorModel: Door) => {
    // Handle inner glass based on decorative_glass_name
    if (doorModel.has_glass) {
      if (doorModel.decorative_glass_name) {
        // If door has a specific decorative glass name, use it
        dispatch(
          setConfigurationField({
            field: "inner-glass-name",
            value: doorModel.decorative_glass_name,
          })
        );
        dispatch(
          setConfigurationField({
            field: "inner-glass-id",
            value: 0,
          })
        );
      } else {
        const configuration = store.getState().configuration;
        dispatch(
          setConfigurationField({
            field: "inner-glass-name",
            value: configuration.defaults["inner-glass-name"],
          })
        );
        dispatch(
          setConfigurationField({
            field: "inner-glass-id",
            value: configuration.defaults["inner-glass-id"],
          })
        );
      }
    } else {
      dispatch(
        setConfigurationField({ field: "inner-glass-name", value: null })
      );
      dispatch(setConfigurationField({ field: "inner-glass-id", value: null }));
    }

    if (doorModel.side_glass_code) {
      dispatch(
        setConfigurationField({
          field: "side-glass-name",
          value: doorModel.side_glass_code,
        })
      );
      dispatch(
        setConfigurationField({
          field: "side-glass-id",
          value: 0,
        })
      );
    } else {
      const configuration = store.getState().configuration;
      dispatch(
        setConfigurationField({
          field: "side-glass-name",
          value: configuration.defaults["side-glass-name"],
        })
      );
      dispatch(
        setConfigurationField({
          field: "side-glass-id",
          value: configuration.defaults["side-glass-id"],
        })
      );
    }

    // Set model name and ID
    dispatch(
      setConfigurationField({
        field: "model-name",
        value: doorModel.model_code,
      })
    );

    dispatch(setConfigurationField({ field: "model-id", value: doorModel.id }));

    // Handle panel color if default
    if (isPanelColorDefault && doorModel.color?.color_code) {
      dispatch(
        setConfigurationField({
          field: "panel-color-name",
          value: doorModel.color.color_code,
        })
      );

      dispatch(
        setConfigurationField({
          field: "panel-color-id",
          value: doorModel.color.id,
        })
      );

      dispatch(
        setConfigurationField({
          field: "frame-color-name",
          value: doorModel.color.color_code,
        })
      );

      dispatch(
        setConfigurationField({
          field: "frame-color-id",
          value: doorModel.color.id,
        })
      );
    }
  };

  const handleSelectDropDownItem = (value: string | null) => {
    if (!value) return;
    dispatch(setActiveDropDownItem({ field: "model", value }));
  };

  if (isLoading) return <SkeletonGrid />;
  if (isError) return <Error message={t("error-occurred")} />;

  return (
    <>
      <SectionHeading>{t("choose-door-model")}</SectionHeading>

      <Select
        options={selectOptions}
        value={selectedDropDownItem}
        onChange={(value) => handleSelectDropDownItem(value)}
        classNames="mb-4"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {doors?.map((doorModel: Door) => {
          const isSelected = selectedModel === doorModel.model_code;
          const fullModelName =
            doorModel.dmodels && doorModel.dmodels.length
              ? `${doorModel.model_code}-${doorModel.dmodels
                  .map((d) => d.suffix)
                  .join("-")}`
              : doorModel.model_code;

          return (
            <Selectable
              key={doorModel.id}
              isSelected={isSelected}
              onClick={() => handleSelectDoorModel(doorModel)}
              classNames="p-4"
            >
              <img
                className="h-40 rounded-lg border border-primary-grey-lightest"
                src={`${process.env.REACT_APP_API_URL}/${doorModel.thumbnail}`}
                alt={`Door Model ${fullModelName}`}
              />

              <span className="mt-3 text-sm font-medium">{fullModelName}</span>
            </Selectable>
          );
        })}
      </div>
    </>
  );
};

export default DoorModel;
