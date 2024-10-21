import * as Scry from "scryfall-sdk";
import {
  Component,
  createResource,
  createSignal,
  Ref,
  Suspense,
} from "solid-js";
import { Select, createOptions } from "@thisbeyond/solid-select";
import "@thisbeyond/solid-select/style.css";

interface SetSelectorProps {
  id?: string;
  class?: string;
  name?: string;
  ref?: Ref<HTMLInputElement>;
  outerRef?: Ref<HTMLDivElement>;
  onChange: (selected: Scry.Set[]) => void;
}

export type SetSelectorElement = Component<SetSelectorProps>;

const SetSelector: SetSelectorElement = ({
  onChange: outerOnChange,
  ...props
}) => {
  const [sets] = createResource(async () => {
    const all = await Scry.Sets.all();
    return all.filter((set) => set.code.length === 3);
  });
  const [initialValue, setInitialValue] = createSignal([], { equals: false });
  const [selectedValues, setSelectedValues] = createSignal<Scry.Set[]>([]);

  const onChange: (values: Scry.Set[]) => void = (selected) => {
    setSelectedValues(selected);
    outerOnChange(selectedValues());
  };

  const format = (value: Scry.Set, _: any, meta: any) => (
    <div class="flex items-center gap-1">
      <span>{meta.highlight ?? value.name}</span>
    </div>
  );

  const extractText = (value: Scry.Set) => value.name;

  const disable = (value: Scry.Set) => selectedValues().includes(value);

  const selectProps = () =>
    createOptions(sets() ?? [], {
      format,
      extractText,
      disable,
    });

  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>
        <div>
          <div
            style={{
              display: "flex",
              "flex-direction": "row",
              "align-items": "center",
              gap: "6px",
            }}
          >
            <div ref={props.outerRef} style={{ flex: "1" }}>
              <Select
                id={props.id}
                class={props.class}
                ref={props.ref}
                name={props.name}
                multiple
                onChange={onChange}
                initialValue={initialValue()}
                {...selectProps()}
              />
            </div>
            <button class="primary-button" onClick={() => setInitialValue([])}>
              Reset
            </button>
          </div>
        </div>
      </Suspense>
    </>
  );
};

export default SetSelector;
