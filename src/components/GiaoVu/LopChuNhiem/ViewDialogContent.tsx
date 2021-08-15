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

const columnDefs = [
  { field: 'maHocSinh', headerName: 'Mã học sinh', flex: 1 },
  { field: 'tenHocSinh', headerName: 'Tên học sinh', flex: 1 },
  {
    field: 'gioiTinh',
    headerName: 'Giới tính',
    flex: 1,
    valueFormatter: (params: any) => (params.value ? 'Nam' : 'Nữ'),
  },
  {
    field: 'ngaySinh',
    headerName: 'Ngày sinh',
    flex: 1,
    valueFormatter: (params: any) => {
      let date = new Date(params.value);
      return `${date.getDate() + 1}/${date.getMonth()}/${date.getFullYear()}`;
    },
  },
];

const ViewDialogContent: React.FC<{ setToggle: () => void; maLopChuNhiem: number }> = ({
  setToggle,
  maLopChuNhiem,
}) => {
  const [giaoVienCN, setGiaoVienCN] = useState(0);
  const [listGV, setlistGV] = useState<{ maGiaoVien: number; tenGiaoVien: string }[]>([]);
  const { data, error } = useSWR<{
    lopChuNhiem: {
      maLopChuNhiem: number;
      NamHoc: {
        maNamHoc: number;
        tenNamHoc: string;
      };
      Lop: {
        maLop: number;
        tenLop: string;
      };
      GiaoVien: {
        maGiaoVien: number;
        tenGiaoVien: string;
      };
      soLuong: number;
    };
    hocSinh: {
      maHocSinh: number;
      tenHocSinh: string;
      gioiTinh: boolean;
      ngaySinh: string;
    }[];
  }>(`/api/giaovien/giaovu/lopchunhiem/${maLopChuNhiem}`);
  useEffect(() => {
    if (data) {
      setGiaoVienCN(data.lopChuNhiem.GiaoVien.maGiaoVien);
    }
  }, [data]);
  if (!data) {
    return (
      <>
        <DialogTitle id="form-dialog-title">Xem lớp chủ nhiệm</DialogTitle>
        <DialogContent>
          <Typography>Loading...</Typography>
        </DialogContent>
      </>
    );
  }
  return (
    <>
      <DialogTitle id="form-dialog-title">
        Chỉnh sửa lớp chủ nhiệm {`${data.lopChuNhiem.Lop.tenLop} (Năm học ${data.lopChuNhiem.NamHoc.tenNamHoc})`}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Grid container alignContent="center" alignItems="center" spacing={2}>
              <Grid item xs>
                <Typography>{`Giáo viên chủ nhiệm: ${data.lopChuNhiem.GiaoVien.maGiaoVien} - ${data.lopChuNhiem.GiaoVien.tenGiaoVien}`}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography>Danh sách học sinh hiện tại của lớp</Typography>
              </Grid>
              <Grid item xs={12}>
                {data.hocSinh.length ? (
                  <div style={{ flex: 1 }}>
                    <div className="ag-theme-alpine">
                      <AgGridReact
                        rowHeight={100}
                        rowData={data.hocSinh}
                        domLayout="autoHeight"
                        columnDefs={columnDefs}
                        stopEditingWhenCellsLoseFocus={true}
                        defaultColDef={{
                          flex: 1,
                          wrapText: true,
                          autoHeight: true,
                          resizable: true,
                        }}
                      ></AgGridReact>
                    </div>
                  </div>
                ) : (
                  <Alert severity="info">Danh sách trống</Alert>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={setToggle} color="primary">
          Đóng
        </Button>
      </DialogActions>
    </>
  );
};

export default ViewDialogContent;
