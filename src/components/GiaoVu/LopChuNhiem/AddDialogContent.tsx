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

import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import useSWR, { mutate } from 'swr';
import axios from 'libs/axios';

import EKhoi from 'enums/EKhoi';

import { toast } from 'react-toastify';

const createLopChuNhiem = ({ maGiaoVien, maLop }: { [key: string]: number }) => {
  return axios({
    method: 'post',
    url: '/api/giaovien/giaovu/lopchunhiem/create',
    data: {
      maGiaoVien,
      maLop,
    },
  });
};
const AddDialogContent: React.FC<{ setToggle: () => void }> = ({ setToggle }) => {
  const [khoi, setKhoi] = useState(EKhoi['Khối 10']);
  const [lop, setLop] = useState(0);
  const [gv, setGV] = useState(0);
  const [listLop, setListLop] = useState<
    {
      maLop: number;
      tenLop: string;
      khoi: number;
    }[]
  >([]);
  const { data, error } = useSWR<{
    lastedNamHoc: {
      maNamHoc: number;
      tenNamHoc: string;
    };
    giaoVien: {
      maGiaoVien: number;
      tenGiaoVien: string;
    }[];
    lopCoTheAssign: {
      maLop: number;
      tenLop: string;
      khoi: number;
    }[];
  }>('/api/giaovien/giaovu/lopchunhiem/assignable', {
    revalidateOnMount: true,
  });

  useEffect(() => {
    if (data && !error) {
      const filter = data.lopCoTheAssign.filter((item) => item.khoi === khoi);
      // console.log(filter);
      setLop(0);
      setListLop(filter);
    }
  }, [khoi, data, error]);
  useEffect(() => {
    if (data && !error && listLop.length) {
      setLop(listLop[0].maLop);
    }
  }, [listLop, data, error]);

  if (!data) {
    return (
      <DialogContent>
        <Typography>Loading...</Typography>
      </DialogContent>
    );
  }
  const { lastedNamHoc, giaoVien, lopCoTheAssign } = data;
  const handleSubmit = async () => {
    if (gv && lop) {
      try {
        await createLopChuNhiem({ maGiaoVien: gv, maLop: lop });
        toast.success('Đã thêm lớp chủ nhiệm mới');
        mutate('/api/giaovien/giaovu/lopchunhiem');
        mutate('/api/giaovien/giaovu/lopchunhiem/assignable');
      } catch (err) {
        toast.error('Có vấn đề khi thêm lớp chủ nhiệm mới');
        console.log(err);
      }
      return;
    }
    toast.warning('Cần phải chọn lớp hoặc giáo viên chủ nhiệm');
  };
  return (
    <>
      <DialogTitle id="form-dialog-title">Thêm lớp chủ nhiệm mới cho năm học {lastedNamHoc.tenNamHoc}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Chọn khối</InputLabel>
              <Select
                placeholder="Chọn khối"
                autoWidth
                value={khoi}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) =>
                  setKhoi(Number.parseInt(event.target.value as string))
                }
              >
                {Object.keys(EKhoi).map((value: string, index) =>
                  Number.isNaN(Number(value)) ? null : (
                    <MenuItem key={index} value={Number.parseInt(value)}>
                      {EKhoi[Number.parseInt(value)]}
                    </MenuItem>
                  ),
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            {listLop.length ? (
              <FormControl fullWidth>
                <InputLabel>Chọn Lớp</InputLabel>
                <Select
                  placeholder="Chọn lớp"
                  autoWidth
                  value={lop}
                  onChange={(event: React.ChangeEvent<{ value: unknown }>) =>
                    setLop(Number.parseInt(event.target.value as string))
                  }
                >
                  {listLop.map(({ maLop, tenLop }, index) => (
                    <MenuItem key={index} value={maLop}>
                      {tenLop}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <div>Khối học này không còn lớp nào để xếp</div>
            )}
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Chọn giáo viên chủ nhiệm</InputLabel>
              <Select
                placeholder="Chọn giáo viên chủ nhiệm"
                autoWidth
                value={gv}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) =>
                  setGV(Number.parseInt(event.target.value as string))
                }
              >
                {giaoVien.map(({ maGiaoVien, tenGiaoVien }, index) => (
                  <MenuItem key={index} value={maGiaoVien}>
                    {`${maGiaoVien} - ${tenGiaoVien}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        {/* <DialogContentText>
          To subscribe to this website, please enter your email address here. We will send updates occasionally.
        </DialogContentText>
        <TextField autoFocus margin="dense" id="name" label="Email Address" type="email" fullWidth /> */}
      </DialogContent>
      <DialogActions>
        <Button onClick={setToggle} color="primary">
          Huỷ
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Thêm mới
        </Button>
      </DialogActions>
    </>
  );
};

export default AddDialogContent;
