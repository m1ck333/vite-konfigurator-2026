import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { setConfigurationField } from "../features/configuration/configurationSlice";
import { RootState } from "../app/store";

type DoorConfiguration = {
  width: number;
  height: number;
  halfPanelWidth: number;
  leftSideWidth: number;
  rightSideWidth: number;
  upperGlassHeight: number;
  type: string;
};

export type DimensionKeys =
  | "width"
  | "height"
  | "halfPanelWidth"
  | "leftSideWidth"
  | "rightSideWidth"
  | "upperGlassHeight";

export type DimensionConfig = {
  key: DimensionKeys;
  label: string;
  min: number;
  max: number;
};

const useConstruction = (doorConfig: DoorConfiguration) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const doorConfiguration = useSelector(
    (state: RootState) => state.configuration
  );

  const numberOfLeftSideGlasses = doorConfiguration["left-side-glass-number"];
  const numberOfRightSideGlasses = doorConfiguration["right-side-glass-number"];

  const setNumberOfLeftSideGlasses = (number: number) => {
    dispatch(
      setConfigurationField({
        field: "left-side-glass-number",
        value: number,
      })
    );
  };

  const setNumberOfRightSideGlasses = (number: number) => {
    dispatch(
      setConfigurationField({
        field: "right-side-glass-number",
        value: number,
      })
    );
  };

  const dimensions = useMemo(
    () => ({
      width: doorConfig.width,
      height: doorConfig.height,
      halfPanelWidth: doorConfig.type.includes("double")
        ? doorConfig.halfPanelWidth
        : 0,
      leftSideWidth:
        doorConfig.type.includes("left") || doorConfig.type.includes("both")
          ? doorConfig.leftSideWidth
          : 0,
      rightSideWidth:
        doorConfig.type.includes("right") || doorConfig.type.includes("both")
          ? doorConfig.rightSideWidth
          : 0,
      upperGlassHeight: doorConfig.type.includes("transom")
        ? doorConfig.upperGlassHeight
        : 0,
    }),
    [doorConfig]
  );

  const dimensionConfigs: DimensionConfig[] = useMemo(() => {
    const configs: DimensionConfig[] = [
      { key: "width", label: t("width-of-door"), min: 960, max: 1300 },
      { key: "height", label: t("height-of-door"), min: 2000, max: 3000 },
      // Add other static configs here
    ];

    if (dimensions.halfPanelWidth !== 0) {
      configs.push({
        key: "halfPanelWidth",
        label: t("half-panel-width"),
        min: 960,
        max: 1300,
      });
    }

    if (dimensions.leftSideWidth !== 0) {
      configs.push({
        key: "leftSideWidth",
        label: t("left-side-width"),
        min: 250,
        max: 1600,
      });
    }

    if (dimensions.rightSideWidth !== 0) {
      configs.push({
        key: "rightSideWidth",
        label: t("right-side-width"),
        min: 250,
        max: 1600,
      });
    }

    if (dimensions.upperGlassHeight !== 0) {
      configs.push({
        key: "upperGlassHeight",
        label: t("upper-glass-height"),
        min: 250,
        max: 1000,
      });
    }

    return configs;
  }, [dimensions, t]);

  const calculateSumOfAllWidths = useCallback(() => {
    return (
      dimensions.width +
      dimensions.halfPanelWidth +
      dimensions.leftSideWidth * numberOfLeftSideGlasses +
      dimensions.rightSideWidth * numberOfRightSideGlasses
    );
  }, [dimensions, numberOfLeftSideGlasses, numberOfRightSideGlasses]);

  const calculateSumOfAllHeights = useCallback(() => {
    return dimensions.height + dimensions.upperGlassHeight;
  }, [dimensions]);

  const handleNumberOfGlassesChange = (
    side: "left" | "right",
    value: number
  ) => {
    if (side === "left") {
      setNumberOfLeftSideGlasses(value);
    } else {
      setNumberOfRightSideGlasses(value);
    }
  };

  const handleDimensionChange = useCallback(
    (dimensionKey: keyof DoorConfiguration, newValue: number) => {
      dispatch(setConfigurationField({ field: dimensionKey, value: newValue }));
    },
    [dispatch]
  );

  return {
    dimensions,
    dimensionConfigs,
    numberOfLeftSideGlasses,
    setNumberOfLeftSideGlasses,
    numberOfRightSideGlasses,
    setNumberOfRightSideGlasses,
    handleNumberOfGlassesChange,
    handleDimensionChange,
    sumOfAllWidths: calculateSumOfAllWidths(),
    sumOfAllHeights: calculateSumOfAllHeights(),
  };
};

export default useConstruction;
