import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingMessage, ServerResponse } from 'http';
import withSession from 'libs/withSession';

import prisma from 'db/prisma';

import CookieBody from 'interfaces/CookieBody';
import UserType from 'enums/UserType';
import UserInfo from 'interfaces/UserInfo';

export default withSession(async function handler(req: any, res: NextApiResponse) {
  const cookie_user: CookieBody = req.session.get('user');
  if (!cookie_user) return res.status(403).end();
  if (cookie_user.type !== UserType.GIAOVIEN) return res.status(403).end();
  const id = cookie_user.id;
  const lop: number = Number.parseInt(req.query.lop);
  let hocsinh = await prisma.hocBa.findMany({
    select: {
      maLopChuNhiem: true,
      maHocSinh: true,
      HocSinh: {
        select: {
          maHocSinh: true,
          tenHocSinh: true,
        },
      },
      nangLuc: true,
      phamChat: true,
      nhanXetKi1: true,
      nhanXetKi2: true,
      lenLop: true,
    },
    where: {
      maLopChuNhiem: lop,
      // LopChuNhiem: {
      //   maGiaoVien: id,
      // },
    },
  });
  let new_hocsinh = hocsinh.map(
    ({ maLopChuNhiem, maHocSinh, HocSinh, nangLuc, phamChat, nhanXetKi1, nhanXetKi2, lenLop }) => ({
      maLopChuNhiem,
      maHocSinh,
      tenHocSinh: HocSinh.tenHocSinh,
      nangLuc,
      phamChat,
      nhanXetKi1,
      nhanXetKi2,
      lenLop,
    }),
  );
  res.status(200).json(new_hocsinh);
});
