import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingMessage, ServerResponse } from 'http';
import withSession from 'libs/withSession';

import prisma from 'db/prisma';

import CookieBody from 'interfaces/CookieBody';
import UserType from 'enums/UserType';
import UserInfo from 'interfaces/UserInfo';

export default withSession(async function handler(req: any, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(400).end();
  const cookie_user: CookieBody = req.session.get('user');
  if (!cookie_user) return res.status(403).end();
  if (cookie_user.type !== UserType.GIAOVIEN) return res.status(403).end();
  const id = cookie_user.id;
  const lop: number = Number.parseInt(req.query.lop);
  const hocsinh: number = Number.parseInt(req.query.hocsinh);
  const { maHocSinh, nangLuc, phamChat, nhanXetKi1, nhanXetKi2, lenLop } = await req.body;
  if (Number.parseInt(maHocSinh) !== hocsinh) return res.status(400).end();
  const hocba = await prisma.hocBa.findUnique({
    where: {
      maLopChuNhiem_maHocSinh: {
        maLopChuNhiem: lop,
        maHocSinh: maHocSinh,
      },
    },
  });
  if (hocba === null) return res.status(404).end();
  const update = await prisma.hocBa.update({
    where: {
      maLopChuNhiem_maHocSinh: {
        maHocSinh: maHocSinh,
        maLopChuNhiem: lop,
      },
    },
    data: {
      nangLuc: nangLuc ? nangLuc : hocba.nangLuc,
      phamChat: phamChat ? phamChat : hocba.phamChat,
      nhanXetKi1: nhanXetKi1 ? nhanXetKi1 : hocba.nhanXetKi1,
      nhanXetKi2: nhanXetKi2 ? nhanXetKi2 : hocba.nhanXetKi2,
      lenLop: lenLop !== null ? lenLop : hocba.lenLop,
    },
  });
  res.status(200).json(update);
});
