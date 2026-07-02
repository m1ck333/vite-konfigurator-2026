import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../app/store";
import { PriceState } from "../../../../../features/price/priceSlice";
import { useTranslation } from "react-i18next";
import { selectUserData } from "../../../../../features/user/userSlice";

const PrintPrices: React.FC = () => {
  const { t } = useTranslation();
  const prices = useSelector((state: RootState) => state.price);
  const modelType = useSelector((state: RootState) => state.configuration.type);

  const loggedUser = useSelector(selectUserData);

  if (!prices.totalPrice || !loggedUser) return null;

  const renderPriceRow = (key: keyof PriceState, label: string) => {
    const price = prices[key];

    const priceWithoutVat =
      typeof price === "object" && price !== null
        ? price.priceWithoutVat
        : price;

    return (
      <tr key={key} className="border-b">
        <td className="border px-2 py-1 font-semibold text-center">{label}</td>
        <td className="border px-2 py-1">kom</td>
        <td className="border px-2 py-1 text-center">1</td>
        <td className="border px-2 py-1 text-right">
          {priceWithoutVat ? priceWithoutVat.toFixed(2) : "0.00"}
        </td>
        <td className="border px-2 py-1 text-right">
          {prices.discount ? prices.discount.toFixed(2) : "0.00"}
        </td>
        <td className="border px-2 py-1 text-right">
          {prices.vat ? prices.vat.toFixed(0) : "0"}%
        </td>
        <td className="border px-2 py-1 text-right">
          {priceWithoutVat ? priceWithoutVat.toFixed(2) : "0.00"}
        </td>
      </tr>
    );
  };

  const adminTableBody = (
    <>
      {renderPriceRow("modelPrice", t("model"))}
      {renderPriceRow("systemPrice", t("system"))}
      {renderPriceRow("colorPrice", t("color"))}
      {renderPriceRow("equipmentPrices", t("equipment"))}
      {renderPriceRow("glassPrices", t("glass"))}
    </>
  );

  const userTableBody = renderPriceRow("totalPrice", t(modelType));

  return (
    <div className="mt-8 p-4 border-t-2 border-gray-300">
      <h3 className="text-lg font-semibold mb-4">{t("price_breakdown")}</h3>
      <table className="w-full border-collapse border text-sm">
        <thead>
          <tr className="bg-primary-grey-light text-white">
            <th className="border px-2 py-1">Naziv robe</th>
            <th className="border px-2 py-1">JM</th>
            <th className="border px-2 py-1">Količina</th>
            <th className="border px-2 py-1">Jedinicna cena</th>
            <th className="border px-2 py-1">Popust (%)</th>
            <th className="border px-2 py-1">PDV stopa</th>
            <th className="border px-2 py-1">Iznos bez PDV</th>
          </tr>
        </thead>
        <tbody>
          {loggedUser?.role === "admin" ? adminTableBody : userTableBody}
        </tbody>
        <tfoot>
          <tr>
            <td
              colSpan={6}
              className="border px-2 py-1 text-right font-semibold"
            >
              Zbir stavki sa stopom {prices.vat ? prices.vat.toFixed(0) : "0"}%:
            </td>
            <td className="border px-2 py-1 text-right">
              {prices.totalPrice?.priceWithoutVat.toFixed(2) || "0.00"}
            </td>
          </tr>
          <tr>
            <td
              colSpan={6}
              className="border px-2 py-1 text-right font-semibold"
            >
              Ukupno osnovica - stopa {prices.vat ? prices.vat.toFixed(0) : "0"}
              %:
            </td>
            <td className="border px-2 py-1 text-right">
              {prices.totalPrice?.priceWithoutVat.toFixed(2) || "0.00"}
            </td>
          </tr>
          <tr>
            <td
              colSpan={6}
              className="border px-2 py-1 text-right font-semibold"
            >
              Ukupno PDV - stopa {prices.vat ? prices.vat.toFixed(0) : "0"}%:
            </td>
            <td className="border px-2 py-1 text-right">
              {(
                (prices.totalPrice?.priceWithVat || 0) -
                (prices.totalPrice?.priceWithoutVat || 0)
              ).toFixed(2)}
            </td>
          </tr>
          <tr>
            <td
              colSpan={6}
              className="border px-2 py-1 text-right font-semibold"
            >
              Ukupan iznos:
            </td>
            <td className="border px-2 py-1 text-right font-semibold">
              {prices.totalPrice?.priceWithVat.toFixed(2) || "0.00"}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default PrintPrices;
