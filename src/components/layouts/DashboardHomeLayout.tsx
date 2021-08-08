import DashboardBaseLayout from './DashboardBaseLayout';
import React from 'react';
import PeopleIcon from '@material-ui/icons/People';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';

import { useRouter } from 'next/router';

const Tab: React.FC = () => {
  const router = useRouter();
  return (
    <>
      <div>
        <Divider />
        <ListSubheader inset>Actor</ListSubheader>
        <ListItem
          button
          onClick={() => {
            router.push('/khach');
          }}
        >
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Khách vãng lai" />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            router.push('/hocsinh');
          }}
        >
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Học sinh" />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            router.push('/phuhuynh');
          }}
        >
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Phụ huynh" />
        </ListItem>

        <ListItem
          button
          onClick={() => {
            router.push('/giaovien');
          }}
        >
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Giáo viên" />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            router.push('/gvcn');
          }}
        >
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Giáo viên chủ nhiệm" />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            router.push('/gvbomon');
          }}
        >
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Giáo viên bộ môn" />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            router.push('/giaovu');
          }}
        >
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Giáo vụ" />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            router.push('/hieutruong');
          }}
        >
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Hiệu trưởng" />
        </ListItem>
        <Divider />
      </div>
    </>
  );
};

const DashboardHomeLayout = ({ children }: { children?: JSX.Element }) => {
  return <DashboardBaseLayout tabs={<Tab />}>{children}</DashboardBaseLayout>;
};

export default DashboardHomeLayout;
