import * as Scry from "scryfall-sdk";
import { Component, createSignal, Suspense } from "solid-js";
import { Select } from "@thisbeyond/solid-select";
import "@thisbeyond/solid-select/style.css";

interface FormatSelectorProps {
  id?: string;
  class?: string;
  onChange: (selected: keyof typeof Scry.Format | "all") => void;
}

const FormatSelector: Component<FormatSelectorProps> = ({
  id,
  class: className,
  onChange: outerOnChange,
}) => {
  const options = [
    "all",
    ...Object.keys(Scry.Format).filter((v) => Number.isNaN(Number.parseInt(v))),
  ];
  console.log(options);

  const [selectedValue, setSelectedValue] =
    createSignal<keyof typeof Scry.Format>("commander");

  const onChange: (value: keyof typeof Scry.Format) => void = (selected) => {
    setSelectedValue(selected);
    outerOnChange(selectedValue());
  };

  return (
    <div>
      <Select
        id={id}
        class={className}
        initialValue={selectedValue()}
        onChange={onChange}
        options={options}
      />
    </div>
  );
};

export default FormatSelector;
