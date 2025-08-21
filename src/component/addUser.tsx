import React, { useState } from "react";
import { TableRow, TableCell, TextField, Button, Box } from "@mui/material";
import type { User } from "../types/User";

type Props = {
  onAdd: (user: Omit<User, "documentId">) => void;
  onCancel: () => void;
};

const AddUser: React.FC<Props> = ({ onAdd, onCancel }) => {
  const [addData, setAddData] = useState<Partial<Omit<User, "documentId">>>({
    FirstName: "",
    LastName: "",
    Username: "",
    Email: "",
    Age: 0,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof User, string>>>({});

  const handleSave = () => {
    const newErrors: Partial<Record<keyof User, string>> = {};

    if (!addData.FirstName?.trim()) newErrors.FirstName = "First name is required.";
    if (!addData.LastName?.trim()) newErrors.LastName = "Last name is required.";
    if (!addData.Username?.trim()) newErrors.Username = "Username is required.";
    if (!addData.Email?.trim()) newErrors.Email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(addData.Email))
      newErrors.Email = "Invalid email format.";
    if (addData.Age === undefined || isNaN(Number(addData.Age)) || Number(addData.Age) <= 0)
      newErrors.Age = "Age must be a valid positive number.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onAdd(addData as Omit<User, "documentId">);

    // reset form
    setAddData({ FirstName: "", LastName: "", Username: "", Email: "", Age: 0 });
    setErrors({});
  };

  return (
    <TableRow>
      {/* Empty ID cell since it's new */}
      <TableCell>New</TableCell>

      <TableCell>
        <TextField
          value={addData.FirstName}
          onChange={(e) => setAddData({ ...addData, FirstName: e.target.value })}
          size="small"
          placeholder="First name"
          error={!!errors.FirstName}
          helperText={errors.FirstName}
        />
      </TableCell>

      <TableCell>
        <TextField
          value={addData.LastName}
          onChange={(e) => setAddData({ ...addData, LastName: e.target.value })}
          size="small"
          placeholder="Last name"
          error={!!errors.LastName}
          helperText={errors.LastName}
        />
      </TableCell>

      <TableCell>
        <TextField
          value={addData.Username}
          onChange={(e) => setAddData({ ...addData, Username: e.target.value })}
          size="small"
          placeholder="Username"
          error={!!errors.Username}
          helperText={errors.Username}
        />
      </TableCell>

      <TableCell>
        <TextField
          value={addData.Email}
          onChange={(e) => setAddData({ ...addData, Email: e.target.value })}
          size="small"
          placeholder="Email"
          error={!!errors.Email}
          helperText={errors.Email}
        />
      </TableCell>

      <TableCell>
        <TextField
          type="number"
          value={addData.Age}
          onChange={(e) => setAddData({ ...addData, Age: Number(e.target.value) })}
          size="small"
          placeholder="Age"
          error={!!errors.Age}
          helperText={errors.Age}
        />
      </TableCell>

      <TableCell>
        <Box display="flex" gap={1}>
          <Button size="small" onClick={handleSave} variant="contained" color="primary">
            Add
          </Button>
          <Button size="small" onClick={onCancel} variant="outlined">
            Cancel
          </Button>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default AddUser;
