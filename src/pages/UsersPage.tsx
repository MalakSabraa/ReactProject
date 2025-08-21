import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TablePagination,
  CircularProgress,
  IconButton,
  Button,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Layout from "../component/layout";
import { addUser, deleteUser, fetchUsers, updateUser } from "../services/users.service";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import type { User } from "../types/User";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import InlineEditUserRow from "../component/editUser";
import AddUser from "../component/addUser";

const Users: React.FC = () => {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchInput);
  const [attribute, setAttribute] = useState<"name" | "email" | "id">("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [viewedUser, setViewedUser] = useState<(User &{numericId? : number})| null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editErrors, setEditErrors] = useState<Partial<Record<keyof User, string>>>({});
  const [editData, setEditData] = useState<Partial<User>>({});
  const [openViewDialog, setOpenViewDialog] = useState(false);

  const queryClient = useQueryClient();

  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token") ||
    undefined;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const { data, isError, isInitialLoading, refetch } = useQuery({
    queryKey: ["users", page, rowsPerPage, debouncedSearch, attribute],
    queryFn: () =>
      fetchUsers(page + 1, rowsPerPage, debouncedSearch, attribute),
    keepPreviousData: true,
  });

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = useMutation({
    mutationFn : async (documentId : string) => {
      await deleteUser(documentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['users']});
      setSnackbarMessage('User deleted successfully');
    },
  });


  const handleAddUser = async (newUser: Omit<User, "documentId">) => {
    try {
      await addUser(newUser, token);
      queryClient.invalidateQueries(["users"]);
      setIsAdding(false);
      setSnackbarMessage("User added successfully");
    } catch (err) {
      console.error("Add user failed:", err);
      setSnackbarMessage("Failed to add user");
    }
  };

  const handleSaveEdit = async (documentId: string) => {
    try {
      await updateUser(documentId, editData);
      setEditingUserId(null);
      refetch();
      setSnackbarMessage(`User updated successfully`);
    } catch (err) {
      console.error(err);
    }
  };

  if (isInitialLoading) {
    return (
      <Box sx={{ p: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography sx={{ mb: 2 }}>Loading users...</Typography>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">Failed to load users.</Typography>
      </Box>
    );
  }

  return (
    <Layout title="Users">
      <Box sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom>
          Users
        </Typography>
        <Typography variant="body2" gutterBottom>
          List of users
        </Typography>

        {/* Search & Filter */}
        <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
          <TextField
            label={`Search by ${attribute}`}
            variant="outlined"
            size="small"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Attribute</InputLabel>
            <Select
              value={attribute}
              label="Attribute"
              onChange={(e) =>
                setAttribute(e.target.value as "name" | "email" | "id")
              }
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="email">Email</MenuItem>
              <MenuItem value="id">ID</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsAdding(true)}
            sx={{ ml: "auto" }}
          >
            Add User
          </Button>
        </Box>

        {/* Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.users.map((t: User, index: number) => {
                const displayId = page * rowsPerPage + index + 1;
                return editingUserId === t.documentId ? (
                  <InlineEditUserRow
                    key={t.documentId}
                    user={{ ...t }}
                    editData={editData}
                    setEditData={setEditData}
                    onSave={() => handleSaveEdit(t.documentId)}
                    onCancel={() => setEditingUserId(null)}
                    errors={editErrors}
                  />
                ) : (
                  <TableRow key={t.documentId}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{t.FirstName ?? "—"}</TableCell>
                    <TableCell>{t.LastName ?? "—"}</TableCell>
                    <TableCell>{t.Username ?? "—"}</TableCell>
                    <TableCell>{t.Email ?? "—"}</TableCell>
                    <TableCell>{t.Age ?? "—"}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        onClick={() => {
                          setEditingUserId(t.documentId);
                          setEditData({
                            FirstName: t.FirstName,
                            LastName: t.LastName,
                            Username: t.Username,
                            Email: t.Email,
                            Age: t.Age,
                          });
                        }}
                      >
                        Edit
                      </Button>
                      <IconButton
  size="small"
  onClick={() => {
    setViewedUser({ ...t, numericId: displayId });
    setOpenViewDialog(true); 
  }}
>
  <VisibilityIcon />
</IconButton>

                      <IconButton
                        size="small"
                        onClick={() => handleDelete.mutate(t.documentId!)}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}

              {/* Inline Add User row */}
              {isAdding && (
                <AddUser
                  onAdd={handleAddUser}
                  onCancel={() => setIsAdding(false)}
                />
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <TablePagination
            component="div"
            count={data?.pageInfo?.total || 0}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="Rows per page:"
          />
        </TableContainer>
      </Box>

      {/* View Dialog */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)}>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent dividers>
          {viewedUser ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography><b>ID:</b> {viewedUser.numericId}</Typography>
              <Typography><b>First Name:</b> {viewedUser.FirstName}</Typography>
              <Typography><b>Last Name:</b> {viewedUser.LastName}</Typography>
              <Typography><b>Username:</b> {viewedUser.Username}</Typography>
              <Typography><b>Email:</b> {viewedUser.Email}</Typography>
              <Typography><b>Age:</b> {viewedUser.Age}</Typography>
            </Box>
          ) : (
            <Typography>No user selected.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={3000}
        onClose={() => setSnackbarMessage(null)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Layout>
  );
};

export default Users;
