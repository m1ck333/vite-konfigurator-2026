import React from "react";
import PrintHeader from "./PrintHeader";
import PrintPrices from "./PrintPrices";

interface SectionData {
  title: string;
  data: Record<string, string | null>;
}

interface ContentToPrintProps {
  sections: Record<string, SectionData>;
  innerDoorImage: string | null;
  outerDoorImage: string | null;
}

const ContentToPrint = React.forwardRef<HTMLDivElement, ContentToPrintProps>(
  ({ sections, innerDoorImage, outerDoorImage }, ref) => {
    return (
      <>
        <div className="px-10 py-4 bg-primary-white rounded-lg" ref={ref}>
          <PrintHeader />

          <div className="text-sm">
            {Object.values(sections).map((section) => (
              <div key={section.title} className="mb-4 rounded-md">
                <h3 className="p-1 mb-2 bg-primary-grey-light text-white font-bold">
                  {section.title}
                </h3>

                <div>
                  {
                    Object.entries(section.data).reduce<{
                      displayedCount: number;
                      elements: JSX.Element[];
                    }>(
                      (acc, [key, value]) => {
                        if (!value) return acc;

                        const bgClass =
                          acc.displayedCount % 2 === 0
                            ? "bg-primary-light"
                            : "";
                        acc.displayedCount += 1;

                        acc.elements.push(
                          <div
                            key={key}
                            className={`flex items-center justify-between p-1  ${bgClass}`}
                          >
                            <span className="font-semibold">{key}:</span>
                            <span>{value}</span>
                          </div>
                        );

                        return acc;
                      },
                      { displayedCount: 0, elements: [] }
                    ).elements
                  }
                </div>
              </div>
            ))}

            <div className="page-break"></div>
          </div>

          <div className="mt-4">
            <PrintHeader />
          </div>

          <div className="flex flex-wrap justify-center gap-10 items-center w-full mt-20">
            <img
              src={`data:image/png;base64,${outerDoorImage}`}
              alt="Outer Door"
              className="max-h-[300px] w-auto rounded-md door-image" // door-image class is used on backend, to target these images
            />

            <img
              src={`data:image/png;base64,${innerDoorImage}`}
              alt="Inner Door"
              className="max-h-[300px] w-auto rounded-md door-image" // door-image class is used on backend, to target these images
            />
          </div>

          <PrintPrices />
        </div>
      </>
    );
  }
);

export default ContentToPrint;
