import { Accessor } from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";

type FieldElement = HTMLInputElement | HTMLTextAreaElement;
type FieldValidator = (element: FieldElement) => string;
type FieldValidatorGroup = {
  element: FieldElement;
  validators: FieldValidator[];
  classList?: DOMTokenList;
};

function checkValid(
  elementValidators: FieldValidatorGroup,
  setErrors: SetStoreFunction<{ [elementName: string]: string }>,
  errorClass: string
) {
  const { element, validators, classList } = elementValidators;
  return async () => {
    element.setCustomValidity("");
    element.checkValidity();
    let message = element.validationMessage;
    if (!message) {
      for (const validator of validators) {
        const text = validator(element);
        if (text) {
          element.setCustomValidity(text);
          break;
        }
      }
      message = element.validationMessage;
    }
    if (message) {
      if (errorClass !== "") {
        if (classList !== undefined) {
          classList.toggle(errorClass, true);
        } else {
          element.classList.toggle(errorClass, true);
        }
      }
      setErrors({ [element.id]: message });
    }
  };
}

type ValidateOptions = {
  classList?: DOMTokenList;
};

export function useForm({ errorClass }: { errorClass: string }) {
  const [errors, setErrors] = createStore<{ [elementName: string]: string }>(
    {}
  );
  const fields: {
    [name: string]: FieldValidatorGroup;
  } = {};

  const [fieldOptions, setFieldOptions] = createStore<{
    [elementName: string]: ValidateOptions;
  }>({});
  const validationOptions = (
    ref: HTMLElement,
    accessor: Accessor<ValidateOptions>
  ) => {
    const opts = accessor();
    setFieldOptions({ [ref.id]: opts });
  };

  const validate = (ref: FieldElement, accessor: Accessor<(() => any)[]>) => {
    const accessorValue = accessor();
    const validators: FieldValidator[] = Array.isArray(accessorValue)
      ? accessorValue
      : [];
    const classList = fieldOptions[ref.id]?.classList;
    let config: FieldValidatorGroup;
    fields[ref.id] = config = { element: ref, validators, classList };
    ref.onblur = checkValid(config, setErrors, errorClass);
    ref.oninput = () => {
      if (!errors[ref.id]) return;
      setErrors({ [ref.id]: undefined });
      if (errorClass !== "") {
        if (classList !== undefined) {
          classList.toggle(errorClass, false);
        } else {
          ref.classList.toggle(errorClass, false);
        }
      }
    };
  };

  const formSubmit = (
    ref: HTMLFormElement,
    accessor: Accessor<(ref: HTMLFormElement) => void>
  ) => {
    const callback = accessor() || (() => {});
    ref.setAttribute("novalidate", "");
    ref.onsubmit = async (e) => {
      e.preventDefault();
      let errored = false;

      for (const k in fields) {
        const field = fields[k];
        await checkValid(field, setErrors, errorClass)();
        if (!errored && field.element.validationMessage) {
          field.element.focus();
          errored = true;
        }
      }
      !errored && callback(ref);
    };
  };

  return { validate, validationOptions, formSubmit, errors };
}

declare module "solid-js" {
  namespace JSX {
    interface DirectiveFunctions {
      validate: (ref: FieldElement, accessor: Accessor<any>) => Promise<void>;
      formSubmit: (ref: HTMLFormElement, accessor: Accessor<any>) => void;
    }
  }
}
