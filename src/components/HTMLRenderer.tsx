interface HTMLRendererProps {
  htmlContent: string | null;
}

const HTMLRenderer: React.FC<HTMLRendererProps> = ({ htmlContent }) => (
  <div
    dangerouslySetInnerHTML={{
      __html: htmlContent ?? "".replace(/\n/g, "<br />"),
    }}
  />
);
export default HTMLRenderer;
