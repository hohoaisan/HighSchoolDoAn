import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import DashboardGiaoVuLayout from 'components/layouts/DashboardGiaoVuLayout';
import {
  Typography,
  Container,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import useStyles from 'styles/Dashboard/common';
import {
  Save as SaveIcon,
  Replay as ReplayIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as EyeIcon,
} from '@material-ui/icons';
import { Alert, AlertTitle } from '@material-ui/lab';

import ProtectedPage from 'components/Auth/ProtectedPage';
import UserType from 'enums/UserType';
import TeacherRole from 'enums/TeacherRole';

import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import useSWR, { mutate } from 'swr';
import axios from 'libs/axios';

import EKhoi from 'enums/EKhoi';

import { toast } from 'react-toastify';

import EditDialogContent from 'components/GiaoVu/LopChuNhiem/EditDialogContent';
import AddDialogContent from 'components/GiaoVu/LopChuNhiem/AddDialogContent';
import DeleteConfirmDialogContent from 'components/GiaoVu/LopChuNhiem/DeleteConfirmDialogContent';
import ViewDialogContent from 'components/GiaoVu/LopChuNhiem/ViewDialogContent';

const columnDefs = [
  { field: 'tenNamHoc', headerName: 'Năm học', flex: 1 },
  { field: 'maLopChuNhiem', headerName: 'Mã lớp', flex: 1 },
  { field: 'tenLop', headerName: 'Tên lớp', flex: 1 },
  { field: 'tenGiaoVien', headerName: 'Giáo viên chủ nhiệm', flex: 1 },
  { field: 'soLuong', headerName: 'Số lượng học sinh', flex: 1 },
  { field: 'maLopChuNhiem', headerName: 'Thao tác', flex: 1, cellRenderer: 'btnCellRenderer' },
];

const Content: React.FC = () => {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteConfirmDialogOpen, setDeleteConfirmDialogOpen] = useState(false);
  const [currentMaLopChuNhiem, setCurrentMaLopChuNhiem] = useState(0);
  const { data, error, mutate } = useSWR<any>('/api/giaovien/giaovu/lopchunhiem', {
    revalidateOnMount: true,
  });

  if (error) {
    return <div>Có lỗi xảy ra vui lòng tải lại trang</div>;
  }
  if (!data) {
    return <div>Loading...</div>;
  }
  const refreshData = () => {
    mutate();
  };
  const handleAddDialog = () => {
    setAddDialogOpen(!addDialogOpen);
  };
  const handleEditDialog = () => {
    setEditDialogOpen(!editDialogOpen);
  };
  const handleDeleteConfirmDialog = () => {
    setDeleteConfirmDialogOpen(!deleteConfirmDialogOpen);
  };
  const handleViewDialog = () => {
    setViewDialogOpen(!viewDialogOpen);
  };
  const lastestNamHoc = data.lastedNamHoc;

  const BtnCellRenderer: React.FC<{ data: any }> = ({ data }) => {
    const cellEditDialog = () => {
      setCurrentMaLopChuNhiem(data.maLopChuNhiem);
      console.log(data.maLopChuNhiem);
      handleEditDialog();
    };
    const cellDeleteDialog = () => {
      setCurrentMaLopChuNhiem(data.maLopChuNhiem);
      console.log(data.maLopChuNhiem);
      handleDeleteConfirmDialog();
    };
    const cellViewDialog = () => {
      setCurrentMaLopChuNhiem(data.maLopChuNhiem);
      console.log(data.maLopChuNhiem);
      handleViewDialog();
    };
    if (data.maNamHoc !== lastestNamHoc)
      return (
        <Grid container spacing={1}>
          <Grid item>
            <IconButton size="small" onClick={cellViewDialog}>
              <EyeIcon />
            </IconButton>
          </Grid>
        </Grid>
      );
    return (
      <Grid container spacing={1}>
        <Grid item>
          <IconButton size="small" onClick={cellViewDialog}>
            <EyeIcon />
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton size="small" onClick={cellEditDialog}>
            <EditIcon />
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton size="small" onClick={cellDeleteDialog}>
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
    );
  };
  return (
    <>
      <Grid item xs={12}>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Grid container spacing={3}>
              <Grid item>
                <Typography align="left" variant="h6">
                  Danh sách lớp chủ nhiệm
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  size="small"
                  onClick={handleAddDialog}
                >
                  Thêm mới
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" startIcon={<ReplayIcon />} size="small" onClick={refreshData}>
              Tải lại
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Alert severity="info">Chỉ có thể cập nhật lớp chủ nhiệm của năm học hiện tại</Alert>
        <div style={{ flex: 1 }}>
          <div className="ag-theme-alpine">
            <AgGridReact
              rowHeight={100}
              rowData={data.lopChuNhiem}
              domLayout="autoHeight"
              columnDefs={columnDefs}
              stopEditingWhenCellsLoseFocus={true}
              frameworkComponents={{ btnCellRenderer: BtnCellRenderer }}
              defaultColDef={{
                flex: 1,
                wrapText: true,
                autoHeight: true,
                resizable: true,
              }}
            ></AgGridReact>
          </div>
        </div>
      </Grid>
      <Dialog open={addDialogOpen} onClose={handleAddDialog} maxWidth="sm" fullWidth>
        {addDialogOpen && <AddDialogContent setToggle={handleAddDialog} />}
      </Dialog>
      <Dialog open={editDialogOpen} onClose={handleEditDialog} maxWidth="md" fullWidth>
        {editDialogOpen && <EditDialogContent setToggle={handleEditDialog} maLopChuNhiem={currentMaLopChuNhiem} />}
      </Dialog>
      <Dialog open={viewDialogOpen} onClose={handleViewDialog} maxWidth="md" fullWidth>
        {viewDialogOpen && <ViewDialogContent setToggle={handleViewDialog} maLopChuNhiem={currentMaLopChuNhiem} />}
      </Dialog>
      <Dialog open={deleteConfirmDialogOpen} onClose={handleDeleteConfirmDialog} maxWidth="sm" fullWidth>
        {deleteConfirmDialogOpen && (
          <DeleteConfirmDialogContent maLopChuNhiem={currentMaLopChuNhiem} setToggle={handleDeleteConfirmDialog} />
        )}
      </Dialog>
    </>
  );
};

export default function Index() {
  const classes = useStyles();
  return (
    <DashboardGiaoVuLayout>
      <ProtectedPage type={UserType.GIAOVIEN} roles={[TeacherRole.GIAOVU]}>
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography align="center" variant="h5">
                      Cập nhật danh sách lớp chủ nhiệm
                    </Typography>
                  </Grid>
                  <Content />
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </ProtectedPage>
    </DashboardGiaoVuLayout>
  );
}
