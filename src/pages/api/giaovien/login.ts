import type { NextApiRequest, NextApiResponse } from 'next';
import withSession from 'libs/session';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import UserType from 'enums/UserType';
import TeacherRole from 'enums/TeacherRole';
import UserCookieBody from 'interfaces/CookieBody';

export default withSession(async function handler(req: any, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(400);
  const { email, password } = await req.body;
  const giaovien = await prisma.giaoVien.findFirst({
    select: {
      maGiaoVien: true,
    },
    where: {
      matKhau: password,
      email: email,
    },
  });
  if (giaovien === null) return res.status(403).end();
  const user: UserCookieBody = {
    id: giaovien.maGiaoVien,
    type: UserType.GIAOVIEN,
  };
  req.session.set('user', user);
  await req.session.save();
  res.status(200).json(user);
});
