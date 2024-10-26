import { ActionMeta, createFilter } from "react-select";
import AsyncSelect from "react-select/async";
import * as Scry from "scryfall-sdk";

export type SetSelectOption = {
  value: string;
  label: string;
};

type SetSelectProps = {
  id?: string;
  name?: string;
  onChange?: (
    option: readonly SetSelectOption[],
    actionMeta: ActionMeta<SetSelectOption>,
  ) => void;
};

async function getOptions() {
  const all = await Scry.Sets.all();
  return all
    .filter((set) => set.code.length === 3)
    .map((v) => ({ value: v.code, label: `${v.name} [${v.code}]` }));
}

export default function SetSelect(props: SetSelectProps) {
  return (
    <AsyncSelect
      id={props.id}
      name={props.name}
      onChange={props.onChange}
      isMulti
      isSearchable
      filterOption={createFilter({
        matchFrom: "any",
      })}
      cacheOptions
      defaultOptions
      loadOptions={getOptions}
    />
  );
}
