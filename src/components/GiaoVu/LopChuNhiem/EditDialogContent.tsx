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

const changeGVCN = ({ maGiaoVien, maLopChuNhiem }: { [key: string]: number }) => {
  return axios({
    method: 'post',
    url: `/api/giaovien/giaovu/lopchunhiem/${maLopChuNhiem}/changegvcn`,
    data: {
      maGiaoVien,
      maLopChuNhiem,
    },
  });
};

const addStudent = ({ maHocSinh, maLopChuNhiem }: { [key: string]: number }) => {
  return axios({
    method: 'post',
    url: `/api/giaovien/giaovu/lopchunhiem/${maLopChuNhiem}/hocsinh/add`,
    data: { maHocSinh, maLopChuNhiem },
  });
};

const removeStudent = ({ maHocSinh, maLopChuNhiem }: { [key: string]: number }) => {
  return axios({
    method: 'post',
    url: `/api/giaovien/giaovu/lopchunhiem/${maLopChuNhiem}/hocsinh/${maHocSinh}/remove`,
    data: { maHocSinh, maLopChuNhiem },
  });
};

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
  { field: 'maHocSinh', headerName: 'Thao tác', flex: 1, cellRenderer: 'btnCellRenderer' },
];

const columnDefsAssignable = [
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
  { field: 'type', headerName: 'Tình trạng', flex: 1 },
  { field: 'maHocSinh', headerName: 'Thao tác', flex: 1, cellRenderer: 'btnCellRenderer' },
];

const AssignableStudent: React.FC<{ maLopChuNhiem: number }> = ({ maLopChuNhiem }) => {
  const { data, error } = useSWR<
    { maHocSinh: number; tenHocSinh: string; gioiTinh: boolean; ngaySinh: string; type: string }[]
  >(`/api/giaovien/giaovu/lopchunhiem/${maLopChuNhiem}/assignablestudent`);
  if (!data) {
    return <div>Loading...</div>;
  }
  const BtnCellRendererAssignable: React.FC<{ data: any }> = ({ data }) => {
    const handleAdd = async () => {
      try {
        await addStudent({ maHocSinh: data.maHocSinh, maLopChuNhiem });
        toast.success(`Đã thêm học sinh "${data.maHocSinh} - ${data.tenHocSinh}" vào lớp`);
        mutate(`/api/giaovien/giaovu/lopchunhiem/${maLopChuNhiem}`);
        mutate(`/api/giaovien/giaovu/lopchunhiem/${maLopChuNhiem}/assignablestudent`);
      } catch (err) {
        toast.error(`Có lỗi xảy ra khi thêm học sinh "${data.maHocSinh} - ${data.tenHocSinh}" vào lớp`);
        console.log(err);
      }
    };
    return (
      <Grid container spacing={1}>
        <Grid item>
          <IconButton size="small" onClick={handleAdd}>
            <AddIcon />
          </IconButton>
        </Grid>
      </Grid>
    );
  };
  return (
    <Grid item xs={12}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography>Danh sách học sinh có thể thêm vào lớp</Typography>
        </Grid>
        <Grid item xs={12}>
          {data.length ? (
            <div style={{ flex: 1 }}>
              <div className="ag-theme-alpine">
                <AgGridReact
                  rowData={data}
                  domLayout="autoHeight"
                  columnDefs={columnDefsAssignable}
                  stopEditingWhenCellsLoseFocus={true}
                  frameworkComponents={{ btnCellRenderer: BtnCellRendererAssignable }}
                  defaultColDef={{
                    flex: 1,
                    resizable: true,
                  }}
                ></AgGridReact>
              </div>
            </div>
          ) : (
            <Alert severity="info">Lớp này chưa có học sinh nào</Alert>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

const EditDialogContent: React.FC<{ setToggle: () => void; maLopChuNhiem: number }> = ({
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
    (async () => {
      const listGV: { maGiaoVien: number; tenGiaoVien: string }[] = await axios
        .get('/api/giaovien/giaovu/listgv')
        .then((res) => res.data);
      setlistGV(listGV);
    })();
  }, []);
  useEffect(() => {
    if (data) {
      setGiaoVienCN(data.lopChuNhiem.GiaoVien.maGiaoVien);
    }
  }, [data]);
  if (!data) {
    return (
      <>
        <DialogTitle id="form-dialog-title">Chỉnh sửa lớp chủ nhiệm</DialogTitle>
        <DialogContent>
          <Typography>Loading...</Typography>
        </DialogContent>
      </>
    );
  }
  const handleSaveGVCN = async () => {
    try {
      await changeGVCN({ maLopChuNhiem, maGiaoVien: giaoVienCN });
      toast.success('Đã sửa thành công giáo viên chủ nhiệm');
      mutate(`/api/giaovien/giaovu/lopchunhiem/${maLopChuNhiem}`);
      mutate(`/api/giaovien/giaovu/lopchunhiem`);
    } catch (err) {
      toast.error('Có lỗi xảy tra khi sửa giáo viên chủ nhiệm, vui lòng thử lại');
      console.log(err);
    }
  };
  const BtnCellRenderer: React.FC<{ data: any }> = ({ data }) => {
    const handleDelete = async () => {
      try {
        await removeStudent({ maHocSinh: data.maHocSinh, maLopChuNhiem });
        toast.success(`Đã xoá học sinh "${data.maHocSinh} - ${data.tenHocSinh}" khỏi lớp`);
        mutate(`/api/giaovien/giaovu/lopchunhiem/${maLopChuNhiem}`);
        mutate(`/api/giaovien/giaovu/lopchunhiem/${maLopChuNhiem}/assignablestudent`);
      } catch (err) {
        toast.error(`Có lỗi xảy ra khi xoá học sinh "${data.maHocSinh} - ${data.tenHocSinh}" khỏi lớp`);
        console.log(err);
      }
    };
    return (
      <Grid container spacing={1}>
        <Grid item>
          <IconButton size="small" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
    );
  };
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
                <FormControl fullWidth>
                  <InputLabel>Giáo viên chủ nhiệm</InputLabel>
                  <Select
                    placeholder="Giáo viên chủ nhiệm"
                    autoWidth
                    value={giaoVienCN}
                    onChange={(event: React.ChangeEvent<{ value: unknown }>) =>
                      setGiaoVienCN(Number.parseInt(event.target.value as string))
                    }
                  >
                    {listGV.map(({ maGiaoVien, tenGiaoVien }, index) => (
                      <MenuItem key={index} value={maGiaoVien}>
                        {`${maGiaoVien} - ${tenGiaoVien}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item>
                <Button variant="contained" color="primary" onClick={handleSaveGVCN}>
                  Lưu
                </Button>
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
                ) : (
                  <Alert severity="info">Danh sách trống</Alert>
                )}
              </Grid>
            </Grid>
          </Grid>
          <AssignableStudent maLopChuNhiem={maLopChuNhiem}></AssignableStudent>
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

export default EditDialogContent;
