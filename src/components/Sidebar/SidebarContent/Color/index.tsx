import { useDispatch, useSelector } from "react-redux";
import { setConfigurationField } from "../../../../features/configuration/configurationSlice";
import { useColors } from "../../../../hooks/useColors";
import { SkeletonGrid } from "../../../ui/Skeleton";
import Error from "../../../ui/Error";
import { Color } from "../../../../types";
import Selectable from "../../../ui/Selectable";
import Select from "../../../ui/Select";
import { RootState } from "../../../../app/store";
import { setActiveDropDownItem } from "../../../../features/sidebar/sidebarSlice";
import { useTranslation } from "react-i18next";
import SectionHeading from "../../../ui/SectionHeading";

const Colors = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const colorType = useSelector(
    (state: RootState) => state.sidebar.activeDropDownItem.color
  );

  const selectedPanelColorId = useSelector(
    (state: RootState) => state.configuration["panel-color-id"]
  );
  const selectedFrameColorId = useSelector(
    (state: RootState) => state.configuration["frame-color-id"]
  );

  const colorTypeOptions = [
    { value: "panel", label: t("panel-color") },
    { value: "frame", label: t("frame-color") },
  ];

  const { colorsByCategory, isLoading, isError } = useColors(colorType);

  const handleColorSelect = (color: Color | null) => {
    dispatch(
      setConfigurationField({
        field: `${colorType}-color`,
        value: color ? color.color_hex || color.thumbnail : null,
      })
    );

    dispatch(
      setConfigurationField({
        field: `${colorType}-color-name`,
        value: color ? color.color_code : null,
      })
    );

    dispatch(
      setConfigurationField({
        field: `${colorType}-color-id`,
        value: color ? color.id : null,
      })
    );

    dispatch(
      setConfigurationField({
        field: "is-panel-color-default",
        value: false,
      })
    );

    if (colorType === "panel") {
      dispatch(
        setConfigurationField({
          field: "frame-color",
          value: color ? color.color_hex || color.thumbnail : null,
        })
      );

      dispatch(
        setConfigurationField({
          field: "frame-color-name",
          value: color ? color.color_code : null,
        })
      );
    }
  };

  const handleColorTypeChange = (value: string | null) => {
    if (value === null) return;
    dispatch(setActiveDropDownItem({ field: "color", value }));
  };

  if (isLoading) return <SkeletonGrid />;
  if (isError) return <Error />;

  return (
    <>
      <SectionHeading>{t("choose-door-color")}</SectionHeading>

      <Select
        options={colorTypeOptions}
        value={colorType}
        onChange={handleColorTypeChange}
        classNames="mb-6"
      />

      {colorsByCategory?.map(({ categoryName, colors }) => (
        <div key={categoryName} className="mb-8">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-primary-grey">
            {categoryName}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-3">
            {colors.map((color: Color) => (
              <Selectable
                key={color.id}
                onClick={() => handleColorSelect(color)}
                isSelected={
                  color.id ===
                  (colorType === "panel"
                    ? selectedPanelColorId
                    : selectedFrameColorId)
                }
              >
                {color.color_hex ? (
                  <div
                    className="w-20 h-20 mx-auto rounded-lg border border-primary-grey-lightest"
                    style={{ backgroundColor: color.color_hex }}
                  />
                ) : (
                  <img
                    className="w-20 h-20 mx-auto rounded-lg object-cover border border-primary-grey-lightest"
                    src={`${process.env.REACT_APP_API_URL}/${color.thumbnail}`}
                    alt={color.color_code}
                  />
                )}
                <div className="mt-2 text-xs text-center font-medium text-primary-grey-dark truncate w-full">
                  {color.color_code}
                </div>
              </Selectable>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default Colors;
