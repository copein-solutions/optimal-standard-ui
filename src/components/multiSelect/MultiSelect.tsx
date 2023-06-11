import React, { ChangeEvent, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

type Option = {
  value: string;
  label: string;
};

type MultiSelectWithSearchProps = {
  label: string;
  options: Option[];
};

export const MultiSelectWithSearch: React.FC<MultiSelectWithSearchProps> = ({
  options,
  label,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
 
  const handleOptionSelect = (
    event: React.ChangeEvent<{}>,
    value: Option[]
  ) => {
    setSelectedOptions(value);
  };

  const getOptionDisabled = (option: Option) => {
    return selectedOptions.some((selectedOption) => selectedOption.value === option.value);
  };

  return (
    <Autocomplete
      multiple
      options={options}
      value={selectedOptions}
      getOptionLabel={(option) => option.label}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label={label}
          placeholder="Buscar"
        />
      )}
      onChange={handleOptionSelect}
      getOptionDisabled={getOptionDisabled}
    />
  );
};

export default MultiSelectWithSearch;
