import React from "react";
import Button from "../../ui/Button";
import { faSave, faX } from "@fortawesome/free-solid-svg-icons";

interface FormFooterProps {
  onCancel: () => void;
  isMutating: boolean;
}

const FormFooter = ({ onCancel, isMutating }: FormFooterProps): JSX.Element => {
  return (
    <div className="flex justify-between border-t border-primary-grey-lightest pt-4 mt-2">
      <Button icon={faX} variant="danger" onClick={onCancel}>
        Odustani
      </Button>

      <Button isLoading={isMutating} icon={faSave} type="submit">
        Sačuvaj
      </Button>
    </div>
  );
};

export default FormFooter;
